import {
  GET_ACCESS_LOG,
  GET_ACCESS_LOG_FAIL,
  GET_ACCESS_LOG_SUCCESS,
  ADD_ACCESS_LOG,
  ADD_ACCESS_LOG_SUCCESS,
  ADD_ACCESS_LOG_FAIL,
  UPDATE_ACCESS_LOG,
  UPDATE_ACCESS_LOG_SUCCESS,
  UPDATE_ACCESS_LOG_FAIL,
  DELETE_ACCESS_LOG,
  DELETE_ACCESS_LOG_SUCCESS,
  DELETE_ACCESS_LOG_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getAccessLog = () => ({
  type: GET_ACCESS_LOG,
});
export const addAccessLog = (AccessLog) => ({
  type: ADD_ACCESS_LOG,
  payload: AccessLog,
});
export const updateAccessLog = (AccessLog) => ({
  type: UPDATE_ACCESS_LOG,
  payload: AccessLog,
});
export const deleteAccessLog = (AccessLog) => ({
  type: DELETE_ACCESS_LOG,
  payload: AccessLog,
});

export const getAccessLogSuccess = (AccessLogs) => ({
  type: GET_ACCESS_LOG_SUCCESS,
  payload: AccessLogs,
});

export const getAccessLogFail = (error) => ({
  type: GET_ACCESS_LOG_FAIL,
  payload: error,
});

export const addAccessLogSuccess = (AccessLog) => ({
  type: ADD_ACCESS_LOG_SUCCESS,
  payload: AccessLog,
});

export const addAccessLogFail = (error) => ({
  type: ADD_ACCESS_LOG_FAIL,
  payload: error,
});

export const updateAccessLogSuccess = (AccessLog) => ({
  type: UPDATE_ACCESS_LOG_SUCCESS,
  payload: AccessLog,
});

export const updateAccessLogFail = (error) => ({
  type: UPDATE_ACCESS_LOG_FAIL,
  payload: error,
});

export const deleteAccessLogSuccess = (AccessLog) => ({
  type: DELETE_ACCESS_LOG_SUCCESS,
  payload: AccessLog,
});

export const deleteAccessLogFail = (error) => ({
  type: DELETE_ACCESS_LOG_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
