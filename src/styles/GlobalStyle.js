// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Import Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.fonts.primary};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textPrimary};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  * {
    box-sizing: border-box;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.accent};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary};
    border-radius: 6px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 20px;
  }

  p {
    color: ${(props) => props.theme.colors.textPrimary};
  }

  button {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.background};
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(47, 18, 59, 0.3);
  }

  button:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  input, textarea {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.textPrimary};
    border: 2px solid ${(props) => props.theme.colors.accent};
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    margin-bottom: 20px;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  input:focus, textarea:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 10px rgba(47, 18, 59, 0.5);
    outline: none;
  }

  /* Responsive Typography */
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    body {
      font-size: 14px;
    }

    h1 {
      font-size: 28px;
    }

    h2 {
      font-size: 24px;
    }
  }

    /* Modal Styles */
  .ReactModal__Overlay {
    background-color: rgba(0, 0, 0, 0.75) !important;
    z-index: 1000 !important;
  }

  .ReactModal__Content {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    right: auto !important;
    bottom: auto !important;
    transform: translate(-50%, -50%) !important;
    background-color: ${(props) => props.theme.colors.background} !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 40px !important;
    overflow: visible !important;
  }
`;

export default GlobalStyle;