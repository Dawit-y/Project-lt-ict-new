import {
  GET_CONTRACT_TERMINATION_REASON,
  GET_CONTRACT_TERMINATION_REASON_FAIL,
  GET_CONTRACT_TERMINATION_REASON_SUCCESS,
  ADD_CONTRACT_TERMINATION_REASON,
  ADD_CONTRACT_TERMINATION_REASON_SUCCESS,
  ADD_CONTRACT_TERMINATION_REASON_FAIL,
  UPDATE_CONTRACT_TERMINATION_REASON,
  UPDATE_CONTRACT_TERMINATION_REASON_SUCCESS,
  UPDATE_CONTRACT_TERMINATION_REASON_FAIL,
  DELETE_CONTRACT_TERMINATION_REASON,
  DELETE_CONTRACT_TERMINATION_REASON_SUCCESS,
  DELETE_CONTRACT_TERMINATION_REASON_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getContractTerminationReason = () => ({
  type: GET_CONTRACT_TERMINATION_REASON,
});
export const addContractTerminationReason = (ContractTerminationReason) => ({
  type: ADD_CONTRACT_TERMINATION_REASON,
  payload: ContractTerminationReason,
});
export const updateContractTerminationReason = (ContractTerminationReason) => ({
  type: UPDATE_CONTRACT_TERMINATION_REASON,
  payload: ContractTerminationReason,
});
export const deleteContractTerminationReason = (ContractTerminationReason) => ({
  type: DELETE_CONTRACT_TERMINATION_REASON,
  payload: ContractTerminationReason,
});

export const getContractTerminationReasonSuccess = (ContractTerminationReasons) => ({
  type: GET_CONTRACT_TERMINATION_REASON_SUCCESS,
  payload: ContractTerminationReasons,
});

export const getContractTerminationReasonFail = (error) => ({
  type: GET_CONTRACT_TERMINATION_REASON_FAIL,
  payload: error,
});

export const addContractTerminationReasonSuccess = (ContractTerminationReason) => ({
  type: ADD_CONTRACT_TERMINATION_REASON_SUCCESS,
  payload: ContractTerminationReason,
});

export const addContractTerminationReasonFail = (error) => ({
  type: ADD_CONTRACT_TERMINATION_REASON_FAIL,
  payload: error,
});

export const updateContractTerminationReasonSuccess = (ContractTerminationReason) => ({
  type: UPDATE_CONTRACT_TERMINATION_REASON_SUCCESS,
  payload: ContractTerminationReason,
});

export const updateContractTerminationReasonFail = (error) => ({
  type: UPDATE_CONTRACT_TERMINATION_REASON_FAIL,
  payload: error,
});

export const deleteContractTerminationReasonSuccess = (ContractTerminationReason) => ({
  type: DELETE_CONTRACT_TERMINATION_REASON_SUCCESS,
  payload: ContractTerminationReason,
});

export const deleteContractTerminationReasonFail = (error) => ({
  type: DELETE_CONTRACT_TERMINATION_REASON_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
