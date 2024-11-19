// src/components/CancelPage.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CancelContainer = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 40px;
`;

const Button = styled(Link)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const CancelPage = () => {
  return (
    <CancelContainer>
      <Title>Payment Canceled</Title>
      <Message>
        Your payment was not completed. You can try again or find another parking spot.
      </Message>
      <Button to="/select-city">Find Another Parking Spot</Button>
    </CancelContainer>
  );
};

export default CancelPage;
