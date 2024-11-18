import React from 'react';
import styled from 'styled-components';
import contactImage from '../Images/contactus1.webp';

const ContactUsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  width: 100%;
  text-align: left;
  font-family: ${(props) => props.theme.fonts.primary};
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Header = styled.header`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for mobile */
  }
`;

const Text = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: 1rem; /* Adjust font size for mobile */
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 100%;
    max-width: 400px; /* Control max image size */
    height: auto;
    border-radius: 15px;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05); /* Slight zoom on hover */
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    img {
      max-width: 300px; /* Smaller image for mobile */
    }
  }

  @media (max-width: 480px) {
    img {
      max-width: 250px; /* Even smaller image for very small screens */
    }
  }
`;

const TextContainer = styled.div`
  flex: 2;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for mobile */
  }
`;

const ContactUs = () => {
  return (
    <ContactUsContainer>
      <ImageContainer>
        <img src={contactImage} alt="Contact Us" />
      </ImageContainer>
      <TextContainer>
        <Header>Contact Us</Header>
        <Text>
          We are dedicated to providing you with the best parking experience possible. If you have any questions, concerns, or feedback, please do not hesitate to get in touch with us. We are here to help and ensure that your experience with Parkwise is smooth and hassle-free.
        </Text>
        <Text>
          Phone Number: 7769881806
        </Text>
        <Text>
          Email: shaikhmohdasad123@gmail.com / shyamalpatil2003@gmail.com
        </Text>
        <Text>
          Our customer support team is available from Monday to Friday, 9:00 AM to 6:00 PM. We strive to respond to all inquiries within 24 hours. For urgent matters, please call us directly.
        </Text>
      </TextContainer>
    </ContactUsContainer>
  );
};

export default ContactUs;
