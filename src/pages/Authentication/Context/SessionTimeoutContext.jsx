import React, { createContext, useState, useEffect, useRef } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { publicRoutes } from "../../../routes";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearAuthData } from "../../../store/auth/actions";

// Create the context
export const SessionTimeoutContext = createContext();

export const SessionTimeoutProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [modal, setModal] = useState(false);

  const inactivityTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Get all public route paths
  const publicRoutePaths = publicRoutes.map((route) => route.path);

  // Check if the current route is public
  const isPublicRoute = publicRoutePaths.includes(location.pathname);

  // Handle session expiration
  const handleSessionExpiration = () => {
    setIsSessionExpired(true);
    setModal(true);
    queryClient.clear();
  };

  // Start inactivity timer
  const startInactivityTimer = () => {
    inactivityTimeoutRef.current = setTimeout(
      handleSessionExpiration,
      60 * 60 * 1000,
    ); // 30 minutes
  };

  // Reset timer on user activity
  const resetTimer = () => {
    if (isSessionExpired) return;
    clearTimeout(inactivityTimeoutRef.current);
    startInactivityTimer();
  };

  // Reset everything (can be called on login or manual reset)
  const resetSession = () => {
    setIsSessionExpired(false);
    setModal(false);
    resetTimer();
  };

  // Attach and cleanup event listeners
  useEffect(() => {
    if (!isPublicRoute) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
      window.addEventListener("touchstart", resetTimer);

      startInactivityTimer();
    }

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      clearTimeout(inactivityTimeoutRef.current);
    };
  }, [location.pathname, isSessionExpired]);

  // Handle redirect after expiration
  const redirectToLogin = () => {
    dispatch(clearAuthData("timeout"));
    setModal(false);
    navigate("/login");
  };

  return (
    <SessionTimeoutContext.Provider value={{ isSessionExpired, resetSession }}>
      {children}
      <Modal isOpen={modal} centered backdrop="static">
        <ModalHeader>Session Expired</ModalHeader>
        <ModalBody>
          <p>
            Your session has expired due to inactivity. Please log in again.
          </p>
          <Button color="danger" onClick={redirectToLogin}>
            Login Again
          </Button>
        </ModalBody>
      </Modal>
    </SessionTimeoutContext.Provider>
  );
};
