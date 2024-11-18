// src/components/ReservationTerms.js
import React from 'react';
import '../components/ReservationTerms.css';

const ReservationTerms = () => {
  return (
    <div className="reservation-terms-container">
      <h1>Reservation Terms and Conditions</h1>
      <p>Welcome to our parking reservation service. By using our service, you agree to the following terms and conditions:</p>
      <ul>
        <li><strong>Reservation Time Limit:</strong> Each reserved parking slot is held for a maximum of 15 minutes.</li>
        <li><strong>Arrival and Departure:</strong> The vehicle must be parked in the reserved slot.</li>
        <li><strong>Usage Fee:</strong> Calculated based on the duration of the reservation.</li>
        <li><strong>Cancellation Policy:</strong> Can be canceled without penalty up to 10 minutes before the reserved time.</li>
        <li><strong>Liability:</strong> Not responsible for any damage, theft, or loss of vehicles.</li>
        <li><strong>User Conduct:</strong> Users must adhere to all parking regulations.</li>
        <li><strong>Force Majeure:</strong> Not liable for any failure to perform due to causes beyond control.</li>
        <li><strong>Privacy Policy:</strong> Personal information is used solely for providing the parking service.</li>
        <li><strong>Customer Support:</strong> Contact customer support via Contact Us.</li>
      </ul>
      <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
    </div>
  );
};

export default ReservationTerms;
