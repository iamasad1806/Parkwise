const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')('sk_test_51PfyRDKNijxf0bHt8Thotj0vPVxR9GsBXMFpfmHztTCqn9stLkISd8RVuMgxUALZ0ENEtXODLlwUT0e2Rn6uXOsZ00gRNRwkUJ');
const endpointSecret = 'whsec_df8d0b468b33ca27d32c78445e31d1705032eb84cd6cb3db0d241a309434c8cf';

const app = express();
app.use(cors());
app.use(express.static('public'));

// Stripe Webhook: Needs raw body for signature verification
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature using Stripe's secret
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Stripe event received:", event); // Log the received event
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout session completion event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const ticketId = session.metadata.ticketId;

    if (!ticketId) {
      console.error('ticketId is undefined in session metadata');
      return res.status(400).send('ticketId is missing');
    }

    console.log(`Processing payment for Ticket ID: ${ticketId}`);

    // Update the corresponding ticket status in Firebase to 'Paid'
    const ticketsRef = admin.database().ref('tickets');
    ticketsRef.child(ticketId).update({ status: 'Paid' }, (error) => {
      if (error) {
        console.error('Error updating ticket status:', error);
        return res.status(500).send({ error: 'Failed to update ticket status.' });
      } else {
        console.log(`Ticket ${ticketId} status updated to Paid.`);
        return res.status(200).send({ received: true });
      }
    });
  } else {
    console.warn(`Unhandled event type ${event.type}`);
    return res.status(400).send(`Unhandled event type ${event.type}`);
  }
});

// Apply bodyParser and express.json() after the webhook route
app.use(bodyParser.json());
app.use(express.json());

// Initialize Firebase
const serviceAccount = require(path.join(__dirname, '../config/firebase-credentials.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://parkwise-18-default-rtdb.firebaseio.com/', // Replace with your Firebase URL
});

const db = admin.database();
const slotsRef = db.ref('slots');
const reservationsRef = db.ref('reservations');
const ticketsRef = db.ref('tickets');

// Helper function to get current IST time
const getISTTime = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;
  return new Date(now.getTime() + utcOffset + istOffset);
};

// Ticket Generation and Payment Handling
async function cancelReservation(slotId, userId) {
  try {
    const now = getISTTime();
    const reservationRef = reservationsRef.child(slotId);
    const reservationSnapshot = await reservationRef.once('value');
    const reservationData = reservationSnapshot.val();

    if (reservationData && reservationData.userId === userId) {
      const startTime = new Date(reservationData.startTime);
      const endTime = now;

      const diffInMilliseconds = endTime - startTime;
      const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));

      const hourlyRate = 100;
      const totalFare = diffInHours * hourlyRate;

      // Generate sequential ticket ID
      const ticketCounterRef = db.ref('ticketCounter');
      const ticketCounterSnapshot = await ticketCounterRef.once('value');
      let ticketCounter = ticketCounterSnapshot.val() || 0;
      const newTicketId = ticketCounter + 1;

      // Update the ticket counter in Firebase
      await ticketCounterRef.set(newTicketId);

      const ticketId = `TICKET-${newTicketId}`;
      await ticketsRef.child(ticketId).set({
        ticketId,
        slotId,
        userId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalTimeParked: diffInHours,
        totalFare,
        status: 'Unpaid',
      });

      await reservationRef.set({
        reserved: false,
        startTime: null,
        endTime: null,
        userId: null,
      });

      await slotsRef.child(slotId).update({
        status: 'Occupied',
        reservedUntil: null,
        reservedBy: null,
      });

      const userRef = db.ref(`users/${userId}`);
      await userRef.update({ activeReservation: null });

      console.log(`Reservation for slot ${slotId} canceled, ticket generated with ID: ${ticketId}.`);
    }
  } catch (error) {
    console.error('Error canceling reservation:', error);
  }
}

// Reservation endpoint with unpaid ticket check
app.post('/reserve-slot', async (req, res) => {
  const { slotId, userId } = req.body;
  const now = getISTTime();
  const endTime = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 minutes later

  try {
    // Check if the user has unpaid tickets
    const unpaidTicketsSnapshot = await ticketsRef.orderByChild('userId').equalTo(userId).once('value');
    const unpaidTickets = unpaidTicketsSnapshot.val();

    if (unpaidTickets) {
      const hasUnpaidTicket = Object.values(unpaidTickets).some(ticket => ticket.status === 'Unpaid');
      if (hasUnpaidTicket) {
        return res.status(400).send({ message: 'You have unpaid tickets. Please pay before reserving a slot.' });
      }
    }

    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    if (userData && userData.activeReservation) {
      return res.status(400).send({ message: 'You already have an active reservation for another slot.' });
    }

    const slotRef = slotsRef.child(slotId);
    const slotSnapshot = await slotRef.once('value');
    const slotData = slotSnapshot.val();

    if (slotData.status === 'Reserved' && slotData.reservedBy !== userId) {
      return res.status(400).send({ message: 'Slot is reserved by another user.' });
    }

    if (slotData.status === 'Occupied') {
      return res.status(400).send({ message: 'Slot is occupied.' });
    }

    await reservationsRef.child(slotId).set({
      reserved: true,
      startTime: now.toISOString(),
      endTime,
      userId,
    });

    await slotRef.update({
      status: 'Reserved',
      reservedUntil: endTime,
      reservedBy: userId,
    });

    await userRef.update({ activeReservation: slotId });

    res.status(200).send({ message: 'Slot reserved successfully', endTime });
  } catch (error) {
    console.error('Error reserving slot:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Cancel Reservation endpoint
app.post('/cancel-reservation', async (req, res) => {
  const { slotId, userId } = req.body;

  try {
    const reservationRef = reservationsRef.child(slotId);
    const reservationSnapshot = await reservationRef.once('value');
    const reservationData = reservationSnapshot.val();

    if (reservationData && reservationData.userId === userId) {
      const now = getISTTime().getTime();
      const reservationStartTime = new Date(reservationData.startTime).getTime();
      const timeElapsed = now - reservationStartTime;

      if (timeElapsed > 10 * 60 * 1000) {
        return res.status(400).send({ message: 'Cannot cancel after 10 minutes.' });
      }

      await reservationRef.set({
        reserved: false,
        startTime: null,
        endTime: null,
        userId: null,
      });
      await slotsRef.child(slotId).update({ status: 'Available', reservedUntil: null });

      const userRef = db.ref(`users/${userId}`);
      await userRef.update({ activeReservation: null });

      res.status(200).send({ message: 'Reservation canceled successfully' });
    } else {
      res.status(400).send({ message: 'No active reservation found for this slot and user.' });
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Update Firebase function to handle slot statuses
async function updateFirebase(slot1, slot2, slot3) {
  try {
    const reservationsSnapshot = await reservationsRef.once('value');
    const reservations = reservationsSnapshot.val();

    const now = getISTTime().toISOString();

    const slot1Status = handleSlotStatus(slot1, reservations.slot1, 'slot1');
    if (slot1Status !== null) {
      await slotsRef.child('slot1').update({ status: slot1Status });
    }

    const slot2Status = handleSlotStatus(slot2, reservations.slot2, 'slot2');
    if (slot2Status !== null) {
      await slotsRef.child('slot2').update({ status: slot2Status });
    }

    const slot3Status = handleSlotStatus(slot3, reservations.slot3, 'slot3');
    if (slot3Status !== null) {
      await slotsRef.child('slot3').update({ status: slot3Status });
    }

    console.log('Firebase updated successfully.');
  } catch (error) {
    console.error('Error updating Firebase:', error);
  }
}

function handleSlotStatus(slot, reservation, slotId) {
  const currentTime = getISTTime().toISOString();

  if (reservation && reservation.reserved && currentTime >= reservation.startTime && currentTime <= reservation.endTime) {
    if (!slot) {
      console.log(`${slotId} is now occupied.`);
      cancelReservation(slotId, reservation.userId);
      return 'Occupied';
    } else if (currentTime > reservation.endTime) {
      console.log(`Reservation for ${slotId} has expired. Resetting slot to Available.`);
      return 'Available';
    }
  } else if (!slot) {
    console.log(`${slotId} is occupied without a reservation.`);
    return 'Occupied';
  } else {
    console.log(`${slotId} is now available.`);
    return 'Available';
  }

  return null;
}

// Stripe Checkout Session endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { ticketId } = req.body;

  try {
    const ticketSnapshot = await ticketsRef.child(ticketId).once('value');
    const ticketData = ticketSnapshot.val();

    if (!ticketData || ticketData.status === 'Paid') {
      return res.status(400).send({ message: 'Invalid or already paid ticket.' });
    }

    const CLIENT_URL = 'http://localhost:3000';  // Replace with your frontend URL

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Parking Ticket ${ticketId}`,
          },
          unit_amount: Math.round(ticketData.totalFare * 100), // Calculate fare in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cancel`,
      metadata: { ticketId },
    });

    res.status(200).send({
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    res.status(500).send({ error: error.message });
  }
});

// Ensure Firebase structure
async function ensureFirebaseStructure() {
  const slotsSnapshot = await slotsRef.once('value');
  const reservationsSnapshot = await reservationsRef.once('value');

  if (!slotsSnapshot.exists()) {
    console.log('Creating slots structure in Firebase...');
    await slotsRef.set({
      slot1: { status: 'Available' },
      slot2: { status: 'Available' },
      slot3: { status: 'Available' },
    });
    console.log('Slots structure created.');
  } else {
    console.log('Slots structure already exists.');
  }

  if (!reservationsSnapshot.exists()) {
    console.log('Creating reservations structure in Firebase...');
    await reservationsRef.set({
      slot1: {
        reserved: false,
        startTime: null,
        endTime: null,
        userId: null,
      },
      slot2: {
        reserved: false,
        startTime: null,
        endTime: null,
        userId: null,
      },
      slot3: {
        reserved: false,
        startTime: null,
        endTime: null,
        userId: null,
      },
    });
    console.log('Reservations structure created.');
  } else {
    console.log('Reservations structure already exists.');
  }
}

// Serial port communication
ensureFirebaseStructure().then(() => {
  const port = new SerialPort({ path: '/dev/cu.usbmodem1201', baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  port.on('open', () => {
    console.log('Serial port opened successfully.');
  });

  port.on('error', (err) => {
    console.error('Error opening serial port:', err.message);
  });

  parser.on('data', async (line) => {
    try {
      console.log('Raw data received from serial port:', line);
      const data = line.trim().split(',').map(Number);

      if (data.length !== 3 || data.some(isNaN)) {
        throw new Error('Invalid data received from sensors.');
      }

      const [slot1, slot2, slot3] = data;
      console.log('Parsed data:', { slot1, slot2, slot3 });
      await updateFirebase(slot1, slot2, slot3);
    } catch (error) {
      console.error(`Error processing data: ${error}`);
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
