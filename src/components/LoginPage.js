import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import styled from 'styled-components';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background}; /* Theme background */
`;

const LoginContainer = styled.div`
  text-align: center;
`;

const LoginHeading = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 20px;
  /* Remove any glowing effect */
  text-shadow: none;
`;

const LoginForm = styled.div`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};

  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background}; /* Match button text to background theme */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent}; /* Changed hover to accent color */
  }
`;

const GoogleSignInButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4285f4; /* Google button color */

  &:hover {
    background-color: #357ae8;
  }

  svg {
    margin-right: 8px;
  }
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  margin-top: 10px;
  text-align: center;
`;

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user)); // Store user in localStorage
      navigate('/select-city'); // Redirect to Select City page
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user)); // Store user in localStorage

      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists() || !snapshot.val().vehicleNumbers || snapshot.val().vehicleNumbers.length === 0) {
        alert('Please complete your profile information.');
        navigate('/profile');
      } else {
        navigate('/select-city'); // Redirect to Select City page
      }
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginContainer>
        <LoginHeading>Login</LoginHeading>
        <LoginForm>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <GoogleSignInButton onClick={handleGoogleSignIn} disabled={loading}>
            <FontAwesomeIcon icon={faGoogle} />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </GoogleSignInButton>
        </LoginForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginContainer>
    </LoginPageContainer>
  );
};

export default LoginPage;
