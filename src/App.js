import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "./components/Header";
import SlotPage from "./components/SlotPage";
import Ticket from "./components/Ticket";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import UserProfilePage from "./components/UserProfilePage";
import ReservationTerms from "./components/ReservationTerms";
import MainPage from "./components/MainPage";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import SelectCity from "./components/SelectCity";
import GradualSpacing from "./components/GradualSpacing";
import SuccessPage from "./components/SuccessPage";
import CancelPage from "./components/CancelPage";
import "./App.css";
import { auth } from "./firebase";

const App = () => {
  const [slots, setSlots] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header currentUser={currentUser} setUser={setCurrentUser} />
      <AnimatedRoutes
        currentUser={currentUser}
        setUser={setCurrentUser}
        slots={slots}
        setSlots={setSlots}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </Router>
  );
};

const AnimatedRoutes = ({
  currentUser,
  setUser,
  slots,
  setSlots,
  selectedCity,
  setSelectedCity,
  selectedLocation,
  setSelectedLocation,
}) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <MainPage currentUser={currentUser} setUser={setUser} />
            }
          />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/register"
            element={<RegisterPage setUser={setUser} />}
          />
          <Route
            path="/profile"
            element={<UserProfilePage user={currentUser} />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reservation-terms" element={<ReservationTerms />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/select-city"
            element={
              <SelectCity
                setSelectedCity={setSelectedCity}
                setSelectedLocation={setSelectedLocation}
                selectedCity={selectedCity}
                selectedLocation={selectedLocation}
              />
            }
          />
          <Route
            path="/slots"
            element={
              <>
                <div className="gradual-main">
                  <GradualSpacing
                    className="gradual-spacing"
                    text="Choose Your Parking Slot"
                  />
                </div>
                <div className="container">
                  <SlotPage
                    currentUser={currentUser}
                    slots={slots}
                    setSlots={setSlots}
                    selectedCity={selectedCity}
                    selectedLocation={selectedLocation}
                  />
                </div>
              </>
            }
          />
          <Route
            path="/ticket"
            element={
              <Ticket
                user={currentUser}
                selectedCity={selectedCity}
                selectedLocation={selectedLocation}
              />
            }
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
