// actions.js
import {
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    FETCH_NOTIFICATIONS_FAILURE,
    MARK_NOTIFICATIONS_AS_READ_REQUEST,
    MARK_NOTIFICATIONS_AS_READ_SUCCESS,
    MARK_NOTIFICATIONS_AS_READ_FAILURE,
  } from './actionTypes';
  
  export const fetchNotificationsRequest = () => ({
    type: FETCH_NOTIFICATIONS_REQUEST,
  });
  
  export const fetchNotificationsSuccess = (data) => ({
    type: FETCH_NOTIFICATIONS_SUCCESS,
    payload: data,
  });
  
  export const fetchNotificationsFailure = (error) => ({
    type: FETCH_NOTIFICATIONS_FAILURE,
    payload: error,
  });

  export const markNotificationsAsReadRequest = (notificationIds) => ({
    type: MARK_NOTIFICATIONS_AS_READ_REQUEST,
    payload: notificationIds,
  });
  
  export const markNotificationsAsReadSuccess = () => ({
    type: MARK_NOTIFICATIONS_AS_READ_SUCCESS,
  });
  
  export const markNotificationsAsReadFailure = (error) => ({
    type: MARK_NOTIFICATIONS_AS_READ_FAILURE,
    payload: error,
  });


  