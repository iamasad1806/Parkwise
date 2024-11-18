import React from 'react';
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ConfirmButton = styled.button`
  background-color: #2F123B; /* Solid button color */
  color: white; /* White text color */
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  text-shadow: none; /* No text-shadow */

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

const CancelButton = styled.button`
  background-color: #2F123B; /* Solid button color */
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  text-shadow: none; /* No text-shadow */

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

const ModalReserve = ({ slot, isOpen, onRequestClose, onReserve }) => {
  if (!slot || !slot.id) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Reserve Parking Slot"
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
          backgroundColor: 'rgba(0, 0, 0, 0.75)', /* Keep overlay for dim effect */
        },
      }}
      ariaHideApp={false}
    >
      <ModalContent>
        {/* Fixed to display "Reserve {slot.displayName}" without repeating "Slot" */}
        <ModalTitle>Reserve {slot.displayName}</ModalTitle>
        <ModalText>Are you sure you want to reserve this parking slot?</ModalText>
        <ModalText>Reservation will hold this slot for 15 minutes.</ModalText>
        <ButtonContainer>
          <ConfirmButton onClick={onReserve}>Confirm Reservation</ConfirmButton>
          <CancelButton onClick={onRequestClose}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ModalReserve;
