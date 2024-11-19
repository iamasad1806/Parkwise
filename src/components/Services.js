import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import step1 from '../Images/step 1.png';
import step2 from '../Images/step 2.png';
import step3 from '../Images/step 3.png';
import step4 from '../Images/step 4.png';

const ServicesContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  width: 100%;
  text-align: left;
  font-family: 'Poppins', sans-serif;
  padding: 50px 0;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 30px 10px; /* Reduced padding for mobile */
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    font-size: 2rem; /* Smaller font size for mobile */
    margin-bottom: 30px; /* Adjust margin for mobile */
  }
`;

const Subtitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: none;

  @media (max-width: 768px) {
    font-size: 1.8rem; /* Adjust font size for mobile */
  }
`;

const StepNumber = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => props.theme.colors.background};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  z-index: 1;
  transition: transform 0.5s ease;

  @media (max-width: 768px) {
    width: 50px; /* Smaller step circle for mobile */
    height: 50px;
    font-size: 1.5rem;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const parallaxEffect = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

const Section = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 80px 0;
  position: relative;
  opacity: 0.3;
  animation: ${fadeInUp} 1.5s ease-in-out forwards;
  flex-direction: ${(props) => (props.reverse ? 'row-reverse' : 'row')};
  background-color: ${(props) => (props.reverse ? props.theme.colors.secondary : props.theme.colors.background)};
  background-image: linear-gradient(
    to bottom, 
    rgba(47, 18, 59, 0.1) 0%, 
    rgba(47, 18, 59, 0.3) 50%, 
    rgba(47, 18, 59, 0.1) 100%
  );
  animation: ${parallaxEffect} 20s linear infinite;

  &:hover ${StepNumber} {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack items vertically on mobile */
    padding: 40px 10px; /* Adjust padding for mobile */
  }
`;

const Image = styled.img`
  width: 400px;
  height: auto;
  border-radius: 15px;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 100%; /* Make the image full width on mobile */
    margin-bottom: 20px; /* Add space between the image and text */
  }
`;

const TextContainer = styled.div`
  width: 38%;

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile */
    text-align: center; /* Center text on mobile */
  }
`;

const Text = styled.p`
  font-size: 1.4rem;
  line-height: 1.8;
  transition: color 0.5s ease;
  color: ${(props) => props.theme.colors.textPrimary};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Adjust font size for mobile */
  }
`;

const Services = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const currentSections = sectionsRef.current; // Store current sections in a local variable

    const options = {
      threshold: 0.5,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        const index = currentSections.indexOf(entry.target); // Use the local variable
        if (entry.isIntersecting) {
          currentSections[index].style.opacity = 1;
        } else {
          currentSections[index].style.opacity = 0.3;
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section); // Use the local variable
      });
    };
  }, []);

  return (
    <ServicesContainer>
      <Header>How It Works</Header>
      <Section ref={(el) => (sectionsRef.current[0] = el)}>
        <TextContainer>
          <Subtitle>Step 1: Register</Subtitle>
          <Text>Users sign up by providing their details and vehicle information.</Text>
        </TextContainer>
        <Image src={step1} alt="Step 1" />
        <StepNumber>1</StepNumber>
      </Section>
      <Section ref={(el) => (sectionsRef.current[1] = el)} reverse>
        <Image src={step2} alt="Step 2" />
        <TextContainer>
          <Subtitle>Step 2: Reserve</Subtitle>
          <Text>Users can reserve a parking slot in advance using the Webapp.</Text>
        </TextContainer>
        <StepNumber>2</StepNumber>
      </Section>
      <Section ref={(el) => (sectionsRef.current[2] = el)}>
        <TextContainer>
          <Subtitle>Step 3: Park</Subtitle>
          <Text>Users park their vehicles in the reserved slot, and the system monitors the duration.</Text>
        </TextContainer>
        <Image src={step3} alt="Step 3" />
        <StepNumber>3</StepNumber>
      </Section>
      <Section ref={(el) => (sectionsRef.current[3] = el)} reverse>
        <Image src={step4} alt="Step 4" />
        <TextContainer>
          <Subtitle>Step 4: Pay</Subtitle>
          <Text>Users can pay for the parking duration through the Webapp.</Text>
        </TextContainer>
        <StepNumber>4</StepNumber>
      </Section>
    </ServicesContainer>
  );
};

export default Services;
