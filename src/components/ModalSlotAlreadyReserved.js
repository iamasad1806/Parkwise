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
  text-shadow: none; /* Remove text-shadow */

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
  text-shadow: none; /* Remove text-shadow */

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
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

const ModalSlotAlreadyReserved = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Slot Already Reserved"
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
        <ModalTitle>Slot Already Reserved</ModalTitle>
        <ModalText>This slot is already reserved. Please select another slot.</ModalText>
        <CloseButton onClick={onRequestClose}>Close</CloseButton>
      </ModalContent>
    </Modal>
  );
};

export default ModalSlotAlreadyReserved;
