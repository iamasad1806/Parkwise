import React, { useState } from 'react';
import styled from 'styled-components';

const FAQContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  width: 100%;
  text-align: left;
  font-family: 'Poppins', sans-serif;
  padding: 50px 0;

  @media (max-width: 768px) {
    padding: 30px 10px; /* Reduced padding for mobile screens */
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};

  @media (max-width: 768px) {
    font-size: 1.8rem; /* Smaller font size for mobile screens */
    margin-bottom: 30px; /* Adjust margin for mobile */
  }
`;

const QuestionBox = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 10px;
  padding: 20px;
  margin: 10px 20%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    margin: 10px 5%; /* Reduce margins for mobile */
    padding: 15px; /* Reduce padding for mobile */
  }
`;

const AnswerBox = styled.div`
  padding: 20px;
  margin: 10px 20%;
  background-color: ${(props) => props.theme.colors.textPrimary};
  color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};

  @media (max-width: 768px) {
    margin: 10px 5%; /* Reduce margins for mobile */
    padding: 15px; /* Reduce padding for mobile */
  }
`;

const Arrow = styled.span`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.primary};
  transition: transform 0.3s ease;
  ${(props) =>
    props.isActive &&
    `
    transform: rotate(180deg);
  `}

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Smaller arrow size on mobile */
  }
`;

const questionsAnswers = [
  {
    question: 'What is Parkwise?',
    answer: 'Parkwise is an intelligent parking system designed to make parking easier and more efficient. Our system allows users to reserve parking slots, track parking duration, and make payments effortlessly.',
  },
  {
    question: 'How do I create an account?',
    answer: "To create an account, click on the 'Sign Up' button on our website or app. Provide your first name, last name, mobile number, car number, and set a password. You'll receive a confirmation email once your account is created.",
  },
  {
    question: 'How do I make a reservation?',
    answer: 'Once logged in, you can view available parking slots and select the one that suits you. After selecting a slot, confirm your reservation. You will have a 15-minute buffer time to arrive at the parking slot.',
  },
  {
    question: 'What happens if I arrive late?',
    answer: 'If you do not arrive within the 15-minute buffer time, your reservation may be canceled. We recommend arriving on time to ensure your slot remains reserved.',
  },
  {
    question: 'How are payments processed?',
    answer: 'All payments are securely processed through Stripe. You can pay for your parking ticket using any major credit or debit card.',
  },
  {
    question: 'How does the sensor detection work?',
    answer: 'Our system uses IR sensors to detect the presence of vehicles. Each parking slot is equipped with two sensors. If both sensors detect an object, the slot is considered occupied. If neither sensor detects anything, the slot is empty.',
  },
  {
    question: 'Can I modify or cancel my reservation?',
    answer: 'Yes, you can modify or cancel your reservation through your account dashboard. Modifications or cancellations must be made within a specified time frame before your reservation starts.',
  },
  {
    question: 'What if I have issues with my reservation or payment?',
    answer: 'If you encounter any issues with your reservation or payment, please contact our customer support team at 7769881806 or shaikhmohdasad123@gmail.com. We are here to assist you.',
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes, we take your privacy seriously. Your personal information is stored securely and only accessible by authorized personnel. For more details, please refer to our Privacy Policy.',
  },
  {
    question: 'How can I provide feedback?',
    answer: 'We value your feedback and suggestions. You can provide feedback through our website or by contacting us at shaikhmohdasad123@gmail.com.',
  },
  {
    question: 'Can I reserve multiple slots?',
    answer: 'No, each user can only reserve one slot at a time. If you need multiple slots, you will need to make separate reservations using different accounts.',
  },
  {
    question: 'How do I view my parking history?',
    answer: 'You can view your parking history by navigating to the "Parking History" section in your account dashboard. It will display all previous reservations and payments made.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <FAQContainer>
      <Header>FAQ</Header>
      {questionsAnswers.map((qa, index) => (
        <div key={index}>
          <QuestionBox onClick={() => toggleQuestion(index)}>
            <span>{qa.question}</span>
            <Arrow isActive={activeIndex === index}>&#9660;</Arrow>
          </QuestionBox>
          {activeIndex === index && (
            <AnswerBox>{qa.answer}</AnswerBox>
          )}
        </div>
      ))}
    </FAQContainer>
  );
};

export default FAQ;
