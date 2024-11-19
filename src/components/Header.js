// src/components/Header.js
import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import BellNotification from './NotificationBell';

const Navbar = styled.nav`
  background-color: ${(props) => props.theme.colors.background};
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid ${(props) => props.theme.colors.accent};
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Menu = styled.ul`
  list-style: none;
  display: flex;
  gap: 25px;
  align-items: center;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none; /* Implement a hamburger menu for mobile */
  }
`;

const MenuItem = styled.li``;

const MenuLink = styled(Link)`
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const Header = ({ currentUser, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        setUser(null);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Navbar>
      <Logo to="/">Parkwise</Logo>
      <Menu>
        <MenuItem>
          <MenuLink to="/about">About Us</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/services">Services</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/faq">FAQ</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/contact">Contact</MenuLink>
        </MenuItem>
        {currentUser ? (
          <>
            <MenuItem>
              <MenuLink to="/select-city">Find Parking Spot</MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/profile">Profile</MenuLink>
            </MenuItem>
            <MenuItem>
              <Button onClick={handleLogout}>Logout</Button>
            </MenuItem>
            <MenuItem>
              <BellNotification currentUser={currentUser} />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <MenuLink to="/login">Login</MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/register">Register</MenuLink>
            </MenuItem>
          </>
        )}
      </Menu>
    </Navbar>
  );
};

export default Header;
