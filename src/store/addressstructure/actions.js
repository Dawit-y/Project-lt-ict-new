import {
  GET_ADDRESS_STRUCTURE,
  GET_ADDRESS_STRUCTURE_FAIL,
  GET_ADDRESS_STRUCTURE_SUCCESS,
  ADD_ADDRESS_STRUCTURE,
  ADD_ADDRESS_STRUCTURE_SUCCESS,
  ADD_ADDRESS_STRUCTURE_FAIL,
  UPDATE_ADDRESS_STRUCTURE,
  UPDATE_ADDRESS_STRUCTURE_SUCCESS,
  UPDATE_ADDRESS_STRUCTURE_FAIL,
  DELETE_ADDRESS_STRUCTURE,
  DELETE_ADDRESS_STRUCTURE_SUCCESS,
  DELETE_ADDRESS_STRUCTURE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getAddressStructure = () => ({
  type: GET_ADDRESS_STRUCTURE,
});
export const addAddressStructure = (AddressStructure) => ({
  type: ADD_ADDRESS_STRUCTURE,
  payload: AddressStructure,
});
export const updateAddressStructure = (AddressStructure) => ({
  type: UPDATE_ADDRESS_STRUCTURE,
  payload: AddressStructure,
});
export const deleteAddressStructure = (AddressStructure) => ({
  type: DELETE_ADDRESS_STRUCTURE,
  payload: AddressStructure,
});

export const getAddressStructureSuccess = (AddressStructures) => ({
  type: GET_ADDRESS_STRUCTURE_SUCCESS,
  payload: AddressStructures,
});

export const getAddressStructureFail = (error) => ({
  type: GET_ADDRESS_STRUCTURE_FAIL,
  payload: error,
});

export const addAddressStructureSuccess = (AddressStructure) => ({
  type: ADD_ADDRESS_STRUCTURE_SUCCESS,
  payload: AddressStructure,
});

export const addAddressStructureFail = (error) => ({
  type: ADD_ADDRESS_STRUCTURE_FAIL,
  payload: error,
});

export const updateAddressStructureSuccess = (AddressStructure) => ({
  type: UPDATE_ADDRESS_STRUCTURE_SUCCESS,
  payload: AddressStructure,
});

export const updateAddressStructureFail = (error) => ({
  type: UPDATE_ADDRESS_STRUCTURE_FAIL,
  payload: error,
});

export const deleteAddressStructureSuccess = (AddressStructure) => ({
  type: DELETE_ADDRESS_STRUCTURE_SUCCESS,
  payload: AddressStructure,
});

export const deleteAddressStructureFail = (error) => ({
  type: DELETE_ADDRESS_STRUCTURE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
