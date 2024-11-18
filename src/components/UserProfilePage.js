import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { ref, get, update } from 'firebase/database';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 60px 40px;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(47, 18, 59, 0.3);
  color: ${(props) => props.theme.colors.textPrimary};

  @media (max-width: 768px) {
    padding: 40px 20px;
  }

  @media (max-width: 480px) {
    padding: 30px 15px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  color: #2F123B; /* Use primary theme color */
  text-align: center;
  margin-bottom: 40px;
  text-shadow: none; /* No glow */

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.accent};
  border-radius: 8px;
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.textPrimary};
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #2F123B;
    box-shadow: 0 0 5px rgba(47, 18, 59, 0.5);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 13px;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #2F123B;
  color: ${(props) => props.theme.colors.background};
  border: none;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  text-align: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const UserProfilePage = ({ user }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [vehicleNumbers, setVehicleNumbers] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setMobile(userData.mobile || '');
          setVehicleNumbers(userData.vehicleNumbers || ['']);
        }
        setIsGoogleUser(user.providerData.some((provider) => provider.providerId === 'google.com'));
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!firstName || !lastName || !mobile || vehicleNumbers.length === 0) {
      setError('Please fill in all the details.');
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    update(userRef, {
      firstName,
      lastName,
      mobile,
      vehicleNumbers,
    }).then(() => {
      if (!isGoogleUser) {
        auth.currentUser.updateEmail(email)
          .then(() => {
            alert('Profile updated successfully!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error updating email:', error);
            setError('Failed to update email. Please try again.');
          });
      } else {
        alert('Profile updated successfully!');
        navigate('/');
      }
    }).catch((error) => {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    });
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigate('/'); // Redirect to the main page after sign-out
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        setError('Failed to sign out. Please try again.');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <Title>User Profile</Title>
      <form>
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isGoogleUser} // Disable email input for Google users
        />
        {vehicleNumbers.map((vehicle, index) => (
          <Input
            key={index}
            type="text"
            placeholder={`Vehicle No. ${index + 1}`}
            value={vehicle}
            onChange={(e) => {
              const newVehicleNumbers = [...vehicleNumbers];
              newVehicleNumbers[index] = e.target.value;
              setVehicleNumbers(newVehicleNumbers);
            }}
          />
        ))}
        <Button type="button" onClick={handleSave}>
          Save Profile
        </Button>
        <Button type="button" onClick={handleSignOut}>
          Sign Out
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </ProfileContainer>
  );
};

export default UserProfilePage;
