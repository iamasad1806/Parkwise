import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Import axios
import availableIcon from '../assets/available.png';
import reservedIcon from '../assets/reserved.png';
import occupiedIcon from '../assets/occupied.png';
import { database } from '../firebase';
import { ref, onValue, get, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import ModalReserve from './ModalReserve';
import ModalReserved from './ModalReserved';
import ModalSlotAlreadyReserved from './ModalSlotAlreadyReserved';
import ModalUnpaidTicket from './ModalUnpaidTicket';

const SlotPageContainer = styled.div`
  padding: 50px 20px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  min-height: calc(100vh - 70px);
  box-shadow: none; /* Ensure no shadow */
  border: none; /* Ensure no border */

  @media (max-width: 768px) {
    padding: 30px 10px; /* Reduce padding for mobile screens */
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
  color: ${(props) => props.theme.colors.primary};
  text-shadow: none; /* Remove glow or shadow */

  @media (max-width: 768px) {
    font-size: 28px; /* Adjust font size for mobile */
  }

  @media (max-width: 480px) {
    font-size: 24px; /* Further adjust for small screens */
  }
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  text-align: center;
  margin-bottom: 20px;
  text-shadow: none; /* Remove glow or shadow */

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for mobile */
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Further adjust for small screens */
  }
`;

const SlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    gap: 20px; /* Adjust gap for mobile screens */
  }
`;

const SlotCard = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    /* Removed box-shadow completely */
  }

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for mobile screens */
  }

  @media (max-width: 480px) {
    padding: 10px; /* Further reduce padding for small screens */
  }
`;

const SlotIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    width: 60px; /* Adjust size for mobile */
    height: 60px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    width: 50px; /* Further adjust size for small screens */
    height: 50px;
  }
`;

const SlotLabel = styled.h3`
  font-size: 22px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.textPrimary};
  text-shadow: none; /* Remove glow or shadow */

  @media (max-width: 768px) {
    font-size: 18px; /* Adjust font size for mobile screens */
  }

  @media (max-width: 480px) {
    font-size: 16px; /* Further adjust font size for small screens */
  }
`;

const SlotPage = ({ currentUser }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reservedModalOpen, setReservedModalOpen] = useState(false);
  const [alreadyReservedModalOpen, setAlreadyReservedModalOpen] = useState(false);
  const [unpaidTicketModalOpen, setUnpaidTicketModalOpen] = useState(false); // State for unpaid ticket modal
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const slotsRef = ref(database, 'slots');
    onValue(
      slotsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const slotsArray = Object.keys(data).map((key) => ({
            id: key,
            status: data[key].status,
            reservedUntil: data[key].reservedUntil || null,
            reservedBy: data[key].reservedBy || null,
            displayName: `Slot ${key.replace('slot', '')}`,
          }));
          setSlots(slotsArray);
        } else {
          setError('No data found in slots');
        }
      },
      (error) => {
        setError(`Error fetching data: ${error.message}`);
      }
    );
  }, []);

  const handleSlotClick = (slot) => {
    if (!slot || !currentUser || !currentUser.uid) {
      setError('User is not logged in or user data is missing.');
      return;
    }

    setReserveModalOpen(false);
    setReservedModalOpen(false);
    setAlreadyReservedModalOpen(false);
    setUnpaidTicketModalOpen(false); // Ensure unpaid ticket modal is closed

    if (slot.status.toLowerCase() === 'available') {
      setSelectedSlot(slot);
      checkUserProfileBeforeReserving();
    } else if (slot.status.toLowerCase() === 'reserved') {
      if (slot.reservedBy !== currentUser.uid) {
        setSelectedSlot(slot);
        setAlreadyReservedModalOpen(true);
      } else {
        setSelectedSlot(slot);
        setReservedModalOpen(true);
      }
    } else if (slot.status.toLowerCase() === 'occupied') {
      alert('This slot is occupied.');
    } else {
      setReservedModalOpen(true);
    }
  };

  const checkUserProfileBeforeReserving = () => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      get(userRef)
        .then((snapshot) => {
          const userData = snapshot.val();
          if (!userData || !userData.vehicleNumbers || userData.vehicleNumbers.length === 0) {
            alert('You must add a vehicle number to reserve a slot.');
            navigate('/profile');
          } else {
            const userTicketsRef = ref(database, `users/${currentUser.uid}/tickets`);
            get(userTicketsRef)
              .then((ticketSnapshot) => {
                const tickets = ticketSnapshot.val();
                const activeTicket =
                  tickets && Object.values(tickets).find((ticket) => ticket.status === 'Reserved');
                if (activeTicket) {
                  alert('You already have an active reservation. You can only reserve one slot at a time.');
                } else {
                  setReserveModalOpen(true);
                }
              })
              .catch((error) => {
                console.error('Error checking active reservations:', error);
                setError('Failed to verify active reservations. Please try again.');
              });
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setError('Failed to verify profile. Please try again.');
        });
    } else {
      setError('User is not logged in.');
    }
  };

  const handleReserve = async () => {
    if (!selectedSlot || !currentUser) return;

    try {
      const response = await axios.post('http://localhost:3001/reserve-slot', {
        slotId: selectedSlot.id,
        userId: currentUser.uid,
      });

      if (response.status === 200) {
        const { endTime } = response.data;

        await update(ref(database, `slots/${selectedSlot.id}`), {
          status: 'Reserved',
          reservedUntil: endTime,
          reserved: true,
          reservedBy: currentUser.uid,
        });

        setReserveModalOpen(false);
        setReservedModalOpen(true);
        console.log(`Slot ${selectedSlot.id} reserved until ${endTime}`);
      } else if (response.data.message === 'First pay the pending ticket.') {
        setUnpaidTicketModalOpen(true); // Open unpaid ticket modal if this error occurs
      } else {
        setError(`Error reserving slot: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error reserving slot:', error);

      await update(ref(database, `slots/${selectedSlot.id}`), {
        status: 'Available',
        reservedUntil: null,
        reservedBy: null,
      });

      setError(`Error reserving slot: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedSlot || !currentUser) return;

    try {
      const response = await axios.post('http://localhost:3001/cancel-reservation', {
        slotId: selectedSlot.id,
        userId: currentUser.uid,
      });

      if (response.status === 200) {
        setSlots((prevSlots) =>
          prevSlots.map((s) =>
            s.id === selectedSlot.id
              ? { ...s, status: 'Available', reservedUntil: null, reserved: false }
              : s
          )
        );
        await update(ref(database, `slots/${selectedSlot.id}`), {
          status: 'Available',
          reservedUntil: null,
          reserved: false,
        });
        setReservedModalOpen(false);
        console.log(`Reservation for Slot ${selectedSlot.id} has been canceled`);
      } else {
        setError(`Error canceling reservation: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      setError(`Error canceling reservation: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <SlotPageContainer>
      <Title>Select a Parking Slot</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SlotsContainer>
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            className={`slot ${slot.status.toLowerCase()}`}
            onClick={() => handleSlotClick(slot)}
          >
            <SlotIcon
              src={
                slot.status.toLowerCase() === 'available'
                  ? availableIcon
                  : slot.status.toLowerCase() === 'reserved'
                  ? reservedIcon
                  : occupiedIcon
              }
              alt={slot.status}
            />
            <SlotLabel>{slot.displayName}</SlotLabel>
          </SlotCard>
        ))}
      </SlotsContainer>
      <ModalReserve
        slot={selectedSlot || {}}
        isOpen={reserveModalOpen}
        onRequestClose={() => setReserveModalOpen(false)}
        onReserve={handleReserve}
      />
      <ModalReserved
        slot={selectedSlot || {}}
        isOpen={reservedModalOpen}
        onRequestClose={() => setReservedModalOpen(false)}
        onCancelReservation={handleCancelReservation}
      />
      <ModalSlotAlreadyReserved
        slot={selectedSlot || {}}
        isOpen={alreadyReservedModalOpen}
        onRequestClose={() => setAlreadyReservedModalOpen(false)}
      />
      <ModalUnpaidTicket
        isOpen={unpaidTicketModalOpen}
        onRequestClose={() => setUnpaidTicketModalOpen(false)}
      />
    </SlotPageContainer>
  );
};

export default SlotPage;
