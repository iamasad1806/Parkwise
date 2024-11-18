// src/components/Cancel.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CancelContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 50px 20px;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.accent};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  margin-top: 10px;
`;

const Cancel = () => {
  const [reservationId, setReservationId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      const response = await axios.post('http://localhost:3001/cancel-reservation', {
        reservationId,
      });

      if (response.status === 200) {
        navigate('/success'); // Redirect to success page
      } else {
        setError('Failed to cancel reservation.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <CancelContainer>
      <Title>Cancel Reservation</Title>
      <Input
        type="text"
        value={reservationId}
        onChange={(e) => setReservationId(e.target.value)}
        placeholder="Enter Reservation ID"
      />
      <Button onClick={handleCancel}>Cancel Reservation</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CancelContainer>
  );
};

export default Cancel;
