import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 40px;
  border-radius: 12px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
  text-shadow: none; /* Remove any text shadow */
  
  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ModalText = styled.p`
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 30px;
  text-shadow: none; /* Remove any text shadow */
  
  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Timer = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
  text-align: center;
  margin: 20px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const CancelButton = styled.button`
  background-color: #2F123B; /* Solid color button */
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  text-shadow: none; /* Remove text shadow */

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
  }

  @media (max-width: 480px) {
    padding: 8px 18px;
  }
`;

const ModalReserved = ({ slot, isOpen, onRequestClose, onCancelReservation }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isOpen && slot) {
      const endTime = new Date(slot.reservedUntil).getTime();
      const updateRemainingTime = () => {
        const now = Date.now();
        const remainingTime = Math.max(endTime - now, 0);
        setTimeLeft(remainingTime);
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, slot]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!slot) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Reserved Slot"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            background: 'none',
            padding: '0',
            overflow: 'visible',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
        ariaHideApp={false}
      >
        <ModalContent>
          <ModalTitle>Error</ModalTitle>
          <ModalText>No slot information available.</ModalText>
          <CancelButton onClick={onRequestClose}>Close</CancelButton>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Reserved Slot"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          background: 'none',
          padding: '0',
          overflow: 'visible',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
      }}
      ariaHideApp={false}
    >
      <ModalContent>
        <ModalTitle>Slot Reserved</ModalTitle>
        <ModalText>
          {slot.displayName} is reserved until {new Date(slot.reservedUntil).toLocaleTimeString()}.
        </ModalText>
        <Timer>Time left: {formatTime(timeLeft)}</Timer>
        <CancelButton onClick={onCancelReservation}>Cancel Reservation</CancelButton>
      </ModalContent>
    </Modal>
  );
};

export default ModalReserved;
