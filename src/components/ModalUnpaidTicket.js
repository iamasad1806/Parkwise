import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 40px;
  border-radius: 12px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const ModalText = styled.p`
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 30px;
`;

const CloseButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const ModalUnpaidTicket = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Unpaid Ticket"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
      }}
      ariaHideApp={false}
    >
      <ModalContent>
        <ModalTitle>Unpaid Ticket</ModalTitle>
        <ModalText>You have an unpaid ticket. Please pay it before reserving a new slot.</ModalText>
        <CloseButton onClick={onRequestClose}>Close</CloseButton>
      </ModalContent>
    </Modal>
  );
};

export default ModalUnpaidTicket;
