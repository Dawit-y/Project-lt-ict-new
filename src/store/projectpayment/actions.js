import {
  GET_PROJECT_PAYMENT,
  GET_PROJECT_PAYMENT_FAIL,
  GET_PROJECT_PAYMENT_SUCCESS,
  ADD_PROJECT_PAYMENT,
  ADD_PROJECT_PAYMENT_SUCCESS,
  ADD_PROJECT_PAYMENT_FAIL,
  UPDATE_PROJECT_PAYMENT,
  UPDATE_PROJECT_PAYMENT_SUCCESS,
  UPDATE_PROJECT_PAYMENT_FAIL,
  DELETE_PROJECT_PAYMENT,
  DELETE_PROJECT_PAYMENT_SUCCESS,
  DELETE_PROJECT_PAYMENT_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectPayment = (projectpayment) => ({
  type: GET_PROJECT_PAYMENT,
  payload:projectpayment
});
export const addProjectPayment = (ProjectPayment) => ({
  type: ADD_PROJECT_PAYMENT,
  payload: ProjectPayment,
});
export const updateProjectPayment = (ProjectPayment) => ({
  type: UPDATE_PROJECT_PAYMENT,
  payload: ProjectPayment,
});
export const deleteProjectPayment = (ProjectPayment) => ({
  type: DELETE_PROJECT_PAYMENT,
  payload: ProjectPayment,
});

export const getProjectPaymentSuccess = (ProjectPayments) => ({
  type: GET_PROJECT_PAYMENT_SUCCESS,
  payload: ProjectPayments,
});

export const getProjectPaymentFail = (error) => ({
  type: GET_PROJECT_PAYMENT_FAIL,
  payload: error,
});

export const addProjectPaymentSuccess = (ProjectPayment) => ({
  type: ADD_PROJECT_PAYMENT_SUCCESS,
  payload: ProjectPayment,
});

export const addProjectPaymentFail = (error) => ({
  type: ADD_PROJECT_PAYMENT_FAIL,
  payload: error,
});

export const updateProjectPaymentSuccess = (ProjectPayment) => ({
  type: UPDATE_PROJECT_PAYMENT_SUCCESS,
  payload: ProjectPayment,
});

export const updateProjectPaymentFail = (error) => ({
  type: UPDATE_PROJECT_PAYMENT_FAIL,
  payload: error,
});

export const deleteProjectPaymentSuccess = (ProjectPayment) => ({
  type: DELETE_PROJECT_PAYMENT_SUCCESS,
  payload: ProjectPayment,
});

export const deleteProjectPaymentFail = (error) => ({
  type: DELETE_PROJECT_PAYMENT_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
