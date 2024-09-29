import {
  GET_CONTRACTOR_TYPE,
  GET_CONTRACTOR_TYPE_FAIL,
  GET_CONTRACTOR_TYPE_SUCCESS,
  ADD_CONTRACTOR_TYPE,
  ADD_CONTRACTOR_TYPE_SUCCESS,
  ADD_CONTRACTOR_TYPE_FAIL,
  UPDATE_CONTRACTOR_TYPE,
  UPDATE_CONTRACTOR_TYPE_SUCCESS,
  UPDATE_CONTRACTOR_TYPE_FAIL,
  DELETE_CONTRACTOR_TYPE,
  DELETE_CONTRACTOR_TYPE_SUCCESS,
  DELETE_CONTRACTOR_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getContractorType = () => ({
  type: GET_CONTRACTOR_TYPE,
});
export const addContractorType = (ContractorType) => ({
  type: ADD_CONTRACTOR_TYPE,
  payload: ContractorType,
});
export const updateContractorType = (ContractorType) => ({
  type: UPDATE_CONTRACTOR_TYPE,
  payload: ContractorType,
});
export const deleteContractorType = (ContractorType) => ({
  type: DELETE_CONTRACTOR_TYPE,
  payload: ContractorType,
});

export const getContractorTypeSuccess = (ContractorTypes) => ({
  type: GET_CONTRACTOR_TYPE_SUCCESS,
  payload: ContractorTypes,
});

export const getContractorTypeFail = (error) => ({
  type: GET_CONTRACTOR_TYPE_FAIL,
  payload: error,
});

export const addContractorTypeSuccess = (ContractorType) => ({
  type: ADD_CONTRACTOR_TYPE_SUCCESS,
  payload: ContractorType,
});

export const addContractorTypeFail = (error) => ({
  type: ADD_CONTRACTOR_TYPE_FAIL,
  payload: error,
});

export const updateContractorTypeSuccess = (ContractorType) => ({
  type: UPDATE_CONTRACTOR_TYPE_SUCCESS,
  payload: ContractorType,
});

export const updateContractorTypeFail = (error) => ({
  type: UPDATE_CONTRACTOR_TYPE_FAIL,
  payload: error,
});

export const deleteContractorTypeSuccess = (ContractorType) => ({
  type: DELETE_CONTRACTOR_TYPE_SUCCESS,
  payload: ContractorType,
});

export const deleteContractorTypeFail = (error) => ({
  type: DELETE_CONTRACTOR_TYPE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
