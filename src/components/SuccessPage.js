// SuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction has been completed successfully.</p>
      <Link to="/profile" className="button">Go to Your Profile</Link>
      <Link to="/select-city" className="button">Find Another Parking Spot</Link>
    </div>
  );
};

export default SuccessPage;
