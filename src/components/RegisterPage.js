import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set } from 'firebase/database';

const RegisterContainer = styled.div`
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
  color: #2F123B;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: none;

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

const RegisterPage = ({ setUser }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleNumbers, setVehicleNumbers] = useState(['']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddVehicle = () => {
    setVehicleNumbers([...vehicleNumbers, '']);
  };

  const isAlphabetic = (str) => /^[A-Za-z]+$/.test(str);
  const isNumeric = (str) => /^[0-9]+$/.test(str);
  const isAlphanumeric = (str) => /^[A-Za-z0-9]+$/.test(str);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isAlphabetic(firstName)) {
      setError('First name should contain only letters.');
      return;
    }
    if (!isAlphabetic(lastName)) {
      setError('Last name should contain only letters.');
      return;
    }
    if (!isNumeric(mobile)) {
      setError('Mobile number should contain only numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    for (const vehicle of vehicleNumbers) {
      if (!isAlphanumeric(vehicle)) {
        setError('Vehicle numbers should contain only letters and numbers.');
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        firstName,
        lastName,
        mobile,
        email,
        vehicleNumbers,
      });

      await auth.signOut();
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please use a different email.');
      } else {
        console.error('Error registering:', error);
        setError(`Failed to register: ${error.message}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
        mobile: '',
        email: user.email,
        vehicleNumbers: [],
      });

      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setError(`Failed to sign in with Google. Please try again: ${error.message}`);
    }
  };

  return (
    <RegisterContainer>
      <Title>Register</Title>
      <form onSubmit={handleRegister}>
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
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <Button type="button" onClick={handleAddVehicle}>
          Add Vehicle
        </Button>
        <Button type="submit">Register</Button>
        <Button type="button" onClick={handleGoogleSignIn}>
          Register with Google
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </RegisterContainer>
  );
};

export default RegisterPage;
