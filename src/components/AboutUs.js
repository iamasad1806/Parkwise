import React from 'react';
import styled, { keyframes } from 'styled-components';
import aboutImage1 from '../Images/aboutus.png';
import aboutImage2 from '../Images/whatwedo.webp';
import aboutImage3 from '../Images/ourvision.webp';
import valuesImage from '../Images/ourvalues.webp';
import teamImage from '../Images/ourteam.jpeg';

const AboutUsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  width: 100%;
  font-family: ${(props) => props.theme.fonts.primary};
  padding: 60px 20px;

  @media (max-width: 768px) {
    padding: 40px 15px; /* Reduced padding on mobile */
  }
`;

const Section = styled.section`
  padding: 40px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  &:nth-child(even) {
    background-color: ${(props) => props.theme.colors.secondary};
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack elements vertically on smaller screens */
    padding: 30px 10px; /* Adjust padding for mobile */
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  margin: 20px;

  img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Subtle shadow for a modern look */
    transition: transform 0.3s ease;
    animation: ${(props) => (props.fromRight ? fadeInRight : fadeInLeft)} 1s ease-in-out;
  }

  img:hover {
    transform: scale(1.05); /* Slight zoom on hover */
  }

  @media (max-width: 768px) {
    max-width: 100%; /* Make images full width on mobile */
    margin: 10px 0; /* Reduce margins for mobile */
  }
`;

const TextContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  margin: 20px;
  animation: ${(props) => (props.fromRight ? fadeInLeft : fadeInRight)} 1s ease-in-out;

  @media (max-width: 768px) {
    max-width: 100%; /* Make text containers full width on mobile */
    margin: 10px 0; /* Reduce margins for mobile */
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  text-shadow: none !important;

  @media (max-width: 768px) {
    font-size: 28px; /* Smaller font size for mobile */
    margin-bottom: 30px; /* Adjust margin for mobile */
  }
`;

const Subtitle = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  text-shadow: none !important;

  @media (max-width: 768px) {
    font-size: 22px; /* Smaller font size for mobile */
    margin-bottom: 15px; /* Adjust margin for mobile */
  }
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: 16px; /* Adjust font size for mobile */
    margin-bottom: 15px; /* Reduce margin for mobile */
  }
`;

const AboutUs = () => {
  return (
    <AboutUsContainer>
      <Title>About Us</Title>

      <Section>
        <TextContainer>
          <Subtitle>Our Mission</Subtitle>
          <Text>
            Parkwise aims to revolutionize the way you park your vehicles by providing a seamless,
            efficient, and user-friendly parking system. Our mission is to make parking easier and more
            convenient for everyone by leveraging advanced technology and innovative solutions.
          </Text>
        </TextContainer>
        <ImageContainer>
          <img src={aboutImage1} alt="Our Mission" fromRight />
        </ImageContainer>
      </Section>

      <Section>
        <ImageContainer>
          <img src={aboutImage2} alt="What We Do" />
        </ImageContainer>
        <TextContainer fromRight>
          <Subtitle>What We Do</Subtitle>
          <Text>
            Parkwise offers an intelligent parking system that allows users to reserve parking slots,
            track their parking duration, and make payments effortlessly. Our system uses advanced
            sensors to monitor the status of each parking slot, ensuring accurate and real-time updates.
            By integrating cutting-edge technology, we aim to reduce the stress and hassle associated
            with parking.
          </Text>
        </TextContainer>
      </Section>

      <Section>
        <TextContainer>
          <Subtitle>Our Vision</Subtitle>
          <Text>
            Our vision is to create a world where parking is no longer a hassle. We are dedicated to
            continuously improving our services and expanding our reach to make parking simple and
            accessible for all. We envision a future where smart parking solutions are the norm,
            contributing to more efficient and sustainable urban mobility.
          </Text>
        </TextContainer>
        <ImageContainer fromRight>
          <img src={aboutImage3} alt="Our Vision" />
        </ImageContainer>
      </Section>

      <Section>
        <ImageContainer>
          <img src={valuesImage} alt="Our Values" />
        </ImageContainer>
        <TextContainer fromRight>
          <Subtitle>Our Values</Subtitle>
          <Text>Innovation: We are committed to embracing new technologies and innovative approaches to enhance our services and stay ahead in the industry.</Text>
          <Text>Customer Focus: Our users are at the heart of everything we do. We strive to provide exceptional service and support to meet their needs and exceed their expectations.</Text>
          <Text>Sustainability: We believe in promoting sustainable practices by reducing traffic congestion and minimizing the environmental impact of parking.</Text>
        </TextContainer>
      </Section>

      <Section>
        <TextContainer>
          <Subtitle>Our Team</Subtitle>
          <Text>
            Our team is comprised of dedicated professionals passionate about making a difference in
            the parking industry. We bring together expertise from various fields, including technology,
            engineering, and customer service, to deliver a top-notch parking solution.
          </Text>
        </TextContainer>
        <ImageContainer fromRight>
          <img src={teamImage} alt="Our Team" />
        </ImageContainer>
      </Section>
    </AboutUsContainer>
  );
};

export default AboutUs;
