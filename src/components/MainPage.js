import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import heroImage from "../Images/homepage.webp"; // Replace with your hero image

const MainPageContainer = styled.div`
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.6)
    ),
    url(${heroImage});
  background-size: cover;
  background-position: center;
  color: ${(props) => props.theme.colors.textPrimary};
  padding: 150px 20px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 80px 10px; /* Adjust padding for mobile */
  }

  @media (max-width: 480px) {
    padding: 60px 10px; /* Further reduce padding for very small screens */
  }
`;

const Heading = styled.h1`
  font-size: 56px;
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: none; /* Remove glowing effect */

  @media (max-width: 768px) {
    font-size: 36px; /* Smaller heading for tablets and smaller devices */
  }

  @media (max-width: 480px) {
    font-size: 28px; /* Further reduce heading size for small screens */
  }
`;

const Subheading = styled.h2`
  font-size: 28px;
  margin-bottom: 50px;
  color: #F4EBE8;
  text-shadow: none; /* Remove glowing effect */

  @media (max-width: 768px) {
    font-size: 20px; /* Adjust subheading for smaller devices */
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 18px; /* Further adjust for smaller screens */
    margin-bottom: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px; /* Reduce button gap for smaller screens */
  }

  @media (max-width: 480px) {
    gap: 10px; /* Further reduce gap for very small screens */
  }
`;

const Button = styled(Link)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 20px;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Adjust font size for mobile */
    padding: 12px 24px; /* Adjust padding for mobile */
  }

  @media (max-width: 480px) {
    font-size: 14px; /* Further adjust font size for small screens */
    padding: 10px 20px; /* Adjust padding for very small screens */
  }
`;

const MainPage = ({ currentUser }) => {
  return (
    <MainPageContainer>
      <Heading>Welcome to Parkwise</Heading>
      <Subheading>The Modern Car Parking Solution</Subheading>
      <ButtonContainer>
        {currentUser ? (
          <Button to="/slots">Find Parking Spot</Button>
        ) : (
          <>
            <Button to="/register">Sign Up</Button>
            <Button to="/contact">Contact Us</Button>
          </>
        )}
      </ButtonContainer>
    </MainPageContainer>
  );
};

export default MainPage;
