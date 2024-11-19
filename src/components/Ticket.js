import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { loadStripe } from '@stripe/stripe-js';
import './Ticket.css';

const stripePromise = loadStripe('pk_test_51PfyRDKNijxf0bHtuOW5vmPzvrRrgrKZwh9v4Jq8fV50qwrtIrzZizOks7WRtj85oEfZZlDZsd1APR0IPqGAdAPN00do42fqql');

const Ticket = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      const ticketsRef = ref(database, `users/${currentUser.uid}/tickets`);
      onValue(ticketsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ticketArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTickets(ticketArray);
        }
      });
    }
  }, [currentUser, navigate]);

  const handlePayment = async (ticketId) => {
    const stripe = await stripePromise;
    try {
      const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, userId: currentUser.uid }),
      });
      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error('Error with payment:', result.error.message);
        alert('Payment failed. Please try again.');
      } else {
        navigate('/confirmation');
      }
    } catch (error) {
      console.error('Error with payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="ticket-page">
      <h1 className="ticket-title">Your Tickets</h1>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <h2>Ticket ID: {ticket.id}</h2>
              <p className={`ticket-status ${ticket.status.toLowerCase()}`}>
                {ticket.status}
              </p>
            </div>
            <div className="ticket-details">
              <p><strong>Slot:</strong> {ticket.slotId}</p>
              <p><strong>Entry Time:</strong> {new Date(ticket.entryTime).toLocaleString()}</p>
              {ticket.exitTime && (
                <>
                  <p><strong>Exit Time:</strong> {new Date(ticket.exitTime).toLocaleString()}</p>
                  <p><strong>Total Time:</strong> {ticket.totalTime} minutes</p>
                </>
              )}
            </div>
            {ticket.status === 'Pending' && (
              <button
                className="pay-now-button"
                onClick={() => handlePayment(ticket.id)}
              >
                Pay Now
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="no-tickets">No tickets available</p>
      )}
    </div>
  );
};

export default Ticket;
