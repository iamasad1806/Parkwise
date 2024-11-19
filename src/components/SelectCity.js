import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SelectCityContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: ${(props) => props.theme.colors.background};
  min-height: calc(100vh - 70px);

  @media (max-width: 768px) {
    padding: 30px 10px; /* Reduce padding on smaller screens */
  }
`;

const Title = styled.h1`
  color: #2F123B;
  margin-bottom: 40px;
  text-shadow: none;

  @media (max-width: 768px) {
    font-size: 24px; /* Adjust font size for mobile screens */
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 20px; /* Further reduce for small phones */
    margin-bottom: 15px;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    gap: 15px; /* Reduce the gap on smaller screens */
    max-width: 100%; /* Ensure the dropdowns take full width on smaller screens */
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.accent};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: #2F123B;
  font-size: 16px;
  
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for mobile */
    padding: 10px; /* Adjust padding for smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 13px; /* Further adjust for very small screens */
    padding: 8px;
  }
`;

const Option = styled.option`
  background-color: ${(props) => props.theme.colors.secondary};
  color: #2F123B;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #2F123B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 30px;
  text-shadow: none;

  @media (max-width: 768px) {
    font-size: 16px; /* Reduce button font size on mobile */
    padding: 12px;
    width: 100%; /* Ensure the button takes the full width */
  }

  @media (max-width: 480px) {
    font-size: 14px; /* Further reduce for small phones */
    padding: 10px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for mobile screens */
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Further reduce for very small screens */
  }
`;

const SelectCity = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const cities = {
    Wanowadi: ['Tribeca Highstreets', '93 avenue', 'Royal Heritage'],
    Hadapsar: ['Amanora mall', 'Seasons', 'Pheonix'],
    Warje: ['Hyatt', 'JW Marriot', 'Lemon Tree'],
  };

  const handleNextPage = () => {
    if (!selectedCity) {
      setErrorMessage('Please select a city.');
      return;
    } else if (!selectedLocation) {
      setErrorMessage('Please select a location.');
      return;
    }

    setErrorMessage(''); // Clear error message
    navigate('/slots', { state: { selectedCity, selectedLocation } });
  };

  return (
    <SelectCityContainer>
      <Title>Select Your City and Location</Title>
      <DropdownContainer>
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <Option value="">Select City</Option>
          {Object.keys(cities).map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
        {selectedCity && (
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <Option value="">Select Location</Option>
            {cities[selectedCity].map((location) => (
              <Option key={location} value={location}>
                {location}
              </Option>
            ))}
          </Select>
        )}
      </DropdownContainer>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button onClick={handleNextPage}>Next</Button>
    </SelectCityContainer>
  );
};

export default SelectCity;
