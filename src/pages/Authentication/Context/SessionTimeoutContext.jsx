import React, { createContext, useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { publicRoutes } from "../../../routes/index";
import { SIDEDATA_CACHE_KEY } from "../../../components/HorizontalLayout/Navbar";

// Create the context
export const SessionTimeoutContext = createContext();

export const SessionTimeoutProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let inactivityTimeout;

  // Function to handle session expiration
  const handleSessionExpiration = () => {
    setIsSessionExpired(true);
    setModal(true); // Show the modal
    // Clear the authentication token from localStorage to fully log out the user
    localStorage.removeItem("authUser");
    localStorage.removeItem(SIDEDATA_CACHE_KEY)
  };

  // Start the inactivity timer
  const startInactivityTimer = () => {
    inactivityTimeout = setTimeout(handleSessionExpiration, 3600000); // 60 minutes
  };

  // Reset timer on user activity
  const resetTimer = () => {
    if (isSessionExpired) return; // Do nothing if the session is already expired
    clearTimeout(inactivityTimeout); // Clear existing timeout
    startInactivityTimer(); // Restart the timer
  };

  // Function to reset everything when user logs in
  const resetSession = () => {
    setIsSessionExpired(false); // Reset the expiration state
    setModal(false); // Hide modal if it's open
    resetTimer(); // Restart inactivity timer
  };

  // Extract paths from publicRoutes array
  const publicRoutePaths = publicRoutes.map((route) => route.path);

  // Helper function to check if the current path is public
  const isPublicRoute = () => {
    return publicRoutePaths.includes(location.pathname);
  };

  // Event listeners for user activity
  useEffect(() => {
    // Start the timer only if the user is not on a public route
    if (!isPublicRoute()) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
      window.addEventListener("touchstart", resetTimer); // Detect touch events

      // Start the timer when the app loads
      startInactivityTimer();
    }
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      clearTimeout(inactivityTimeout); // Clear timeout on unmount
    };
  }, [isSessionExpired, location.pathname]);

  // Redirect to login page when session expires
  const redirectToLogin = () => {
    setModal(false);
    navigate("/login");
  };

  return (
    <SessionTimeoutContext.Provider value={{ isSessionExpired, resetSession }}>
      {children}

      {/* Modal to alert session expiration */}
      <Modal isOpen={modal}>
        <ModalHeader>Session Expired</ModalHeader>
        <ModalBody>
          Your session has expired due to inactivity. Please log in again.
          <div className="mt-3">
            <Button color="danger" onClick={redirectToLogin}>
              Login Again
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </SessionTimeoutContext.Provider>
  );
};
