import React, { useEffect, useState } from 'react';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase';  // Ensure your Firebase config is imported
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import '../components/NotificationBell.css'; // Ensure your CSS file is correctly imported

// Initialize Stripe with your test public key
const stripePromise = loadStripe('pk_test_51PfyRDKNijxf0bHtuOW5vmPzvrRrgrKZwh9v4Jq8fV50qwrtIrzZizOks7WRtj85oEfZZlDZsd1APR0IPqGAdAPN00do42fqql');

const NotificationBell = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Fetch user information
      const userRef = ref(database, `users/${currentUser.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log('User Info:', snapshot.val());
            setUserInfo(snapshot.val());
          } else {
            console.log('No user information found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });

      // Fetch tickets for the current user
      const ticketsRef = query(ref(database, 'tickets'), orderByChild('userId'), equalTo(currentUser.uid));
      get(ticketsRef)
        .then((snapshot) => {
          const data = snapshot.val();
          console.log('Fetched Tickets:', data);
          if (data) {
            const ticketArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setTickets(ticketArray);
          } else {
            console.log('No tickets found for the user.');
            setTickets([]); // No tickets found
          }
        })
        .catch((error) => {
          console.error('Error fetching tickets:', error);
        });
    }
  }, [currentUser]);

  // Handle Stripe Payment
  const handlePayment = async (ticketId, totalFare) => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post('http://localhost:3001/create-checkout-session', {
        ticketId,
        amount: totalFare,
      });

      const { sessionId } = response.data;

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe Checkout Error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error with payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Close dropdown when mouse leaves
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="notification-bell">
      <span
        className="bell-icon"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        role="img"
        aria-label="notification bell"
      >
        🔔
      </span>
      {dropdownOpen && (
        <div className="dropdown" onMouseLeave={closeDropdown}>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <div key={index} className="dropdown-item">
                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Total Fare:</strong> {ticket.totalFare} Rs</p>
                <p><strong>Time Parked:</strong> {ticket.totalTimeParked} hour(s)</p>
                <p><strong>Vehicle Number:</strong> {userInfo.vehicleNumbers?.[0] || 'N/A'}</p>
                <p><strong>User:</strong> {userInfo.firstName || 'N/A'} {userInfo.lastName || ''}</p>
                <button
                  onClick={() => handlePayment(ticket.id, ticket.totalFare)}
                  disabled={ticket.status === 'Paid'}
                >
                  {ticket.status === 'Paid' ? 'Paid' : 'Pay Now'}
                </button>
              </div>
            ))
          ) : (
            <div className="dropdown-item">
              <p>No tickets available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
