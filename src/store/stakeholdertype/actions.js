import {
  GET_STAKEHOLDER_TYPE,
  GET_STAKEHOLDER_TYPE_FAIL,
  GET_STAKEHOLDER_TYPE_SUCCESS,
  ADD_STAKEHOLDER_TYPE,
  ADD_STAKEHOLDER_TYPE_SUCCESS,
  ADD_STAKEHOLDER_TYPE_FAIL,
  UPDATE_STAKEHOLDER_TYPE,
  UPDATE_STAKEHOLDER_TYPE_SUCCESS,
  UPDATE_STAKEHOLDER_TYPE_FAIL,
  DELETE_STAKEHOLDER_TYPE,
  DELETE_STAKEHOLDER_TYPE_SUCCESS,
  DELETE_STAKEHOLDER_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getStakeholderType = () => ({
  type: GET_STAKEHOLDER_TYPE,
});
export const addStakeholderType = (StakeholderType) => ({
  type: ADD_STAKEHOLDER_TYPE,
  payload: StakeholderType,
});
export const updateStakeholderType = (StakeholderType) => ({
  type: UPDATE_STAKEHOLDER_TYPE,
  payload: StakeholderType,
});
export const deleteStakeholderType = (StakeholderType) => ({
  type: DELETE_STAKEHOLDER_TYPE,
  payload: StakeholderType,
});

export const getStakeholderTypeSuccess = (StakeholderTypes) => ({
  type: GET_STAKEHOLDER_TYPE_SUCCESS,
  payload: StakeholderTypes,
});

export const getStakeholderTypeFail = (error) => ({
  type: GET_STAKEHOLDER_TYPE_FAIL,
  payload: error,
});

export const addStakeholderTypeSuccess = (StakeholderType) => ({
  type: ADD_STAKEHOLDER_TYPE_SUCCESS,
  payload: StakeholderType,
});

export const addStakeholderTypeFail = (error) => ({
  type: ADD_STAKEHOLDER_TYPE_FAIL,
  payload: error,
});

export const updateStakeholderTypeSuccess = (StakeholderType) => ({
  type: UPDATE_STAKEHOLDER_TYPE_SUCCESS,
  payload: StakeholderType,
});

export const updateStakeholderTypeFail = (error) => ({
  type: UPDATE_STAKEHOLDER_TYPE_FAIL,
  payload: error,
});

export const deleteStakeholderTypeSuccess = (StakeholderType) => ({
  type: DELETE_STAKEHOLDER_TYPE_SUCCESS,
  payload: StakeholderType,
});

export const deleteStakeholderTypeFail = (error) => ({
  type: DELETE_STAKEHOLDER_TYPE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
