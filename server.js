const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const cron = require('node-cron');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase
const serviceAccount = require('/Users/m.asad/Desktop/CPP/config/firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://parkwise-18-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const slotsRef = db.ref('slots');
const reservationsRef = db.ref('reservations');

// Reservation endpoint
app.post('/reserve-slot', async (req, res) => {
  const { slotId } = req.body;
  const now = new Date();
  const endTime = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 minutes later

  try {
    await reservationsRef.child(slotId).set({
      reserved: true,
      startTime: now.toISOString(),
      endTime: endTime
    });
    await slotsRef.child(slotId).update({ status: 'Reserved' });
    res.status(200).send({ success: true, endTime });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Periodically check and reset expired reservations
cron.schedule('* * * * *', async () => {
  const now = new Date().toISOString();
  const reservationsSnapshot = await reservationsRef.once('value');
  const reservations = reservationsSnapshot.val();

  for (const [slotId, reservation] of Object.entries(reservations)) {
    if (reservation.reserved && now > reservation.endTime) {
      await reservationsRef.child(slotId).set({
        reserved: false,
        startTime: null,
        endTime: null
      });
      await slotsRef.child(slotId).update({ status: 'Available' });
    }
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
      slot3: { status: 'Available' }
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
        endTime: null
      },
      slot2: {
        reserved: false,
        startTime: null,
        endTime: null
      },
      slot3: {
        reserved: false,
        startTime: null,
        endTime: null
      }
    });
    console.log('Reservations structure created.');
  } else {
    console.log('Reservations structure already exists.');
  }
}

// Initialize Firebase structure
ensureFirebaseStructure().then(() => {
  // Open serial port
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
      const [slot1, slot2, slot3] = line.trim().split(',').map(Number);
      console.log('Parsed data:', { slot1, slot2, slot3 });
      await updateFirebase(slot1, slot2, slot3);
    } catch (error) {
      console.error(`Error processing data: ${error}`);
    }
  });
});

async function updateFirebase(slot1, slot2, slot3) {
  try {
    const reservationsSnapshot = await reservationsRef.once('value');
    const reservations = reservationsSnapshot.val();
    console.log('Reservations:', reservations);

    const slot1Status = getSlotStatus(slot1, reservations.slot1);
    const slot2Status = getSlotStatus(slot2, reservations.slot2);
    const slot3Status = getSlotStatus(slot3, reservations.slot3);

    console.log('Updating Firebase:', { slot1Status, slot2Status, slot3Status });

    await slotsRef.update({
      slot1: { status: slot1Status },
      slot2: { status: slot2Status },
      slot3: { status: slot3Status }
    });
    console.log('Firebase updated successfully.');
  } catch (error) {
    console.error('Error updating Firebase:', error);
  }
}

function getSlotStatus(slot, reservation) {
  const currentTime = new Date().toISOString();
  if (reservation && reservation.reserved) {
    if (currentTime < reservation.endTime) {
      return slot ? 'Available (Reserved)' : 'Occupied (Reserved)';
    } else {
      // Reset the reservation if the buffer time has passed
      reservationsRef.child(reservation.id).set({
        reserved: false,
        startTime: null,
        endTime: null
      });
      return slot ? 'Available' : 'Occupied';
    }
  }
  return slot ? 'Available' : 'Occupied';
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
