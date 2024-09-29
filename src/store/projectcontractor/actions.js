import {
  GET_PROJECT_CONTRACTOR,
  GET_PROJECT_CONTRACTOR_FAIL,
  GET_PROJECT_CONTRACTOR_SUCCESS,
  ADD_PROJECT_CONTRACTOR,
  ADD_PROJECT_CONTRACTOR_SUCCESS,
  ADD_PROJECT_CONTRACTOR_FAIL,
  UPDATE_PROJECT_CONTRACTOR,
  UPDATE_PROJECT_CONTRACTOR_SUCCESS,
  UPDATE_PROJECT_CONTRACTOR_FAIL,
  DELETE_PROJECT_CONTRACTOR,
  DELETE_PROJECT_CONTRACTOR_SUCCESS,
  DELETE_PROJECT_CONTRACTOR_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectContractor = (projectid) => ({
  type: GET_PROJECT_CONTRACTOR,
  payload:projectid
});
export const addProjectContractor = (ProjectContractor) => ({
  type: ADD_PROJECT_CONTRACTOR,
  payload: ProjectContractor,
});
export const updateProjectContractor = (ProjectContractor) => ({
  type: UPDATE_PROJECT_CONTRACTOR,
  payload: ProjectContractor,
});
export const deleteProjectContractor = (ProjectContractor) => ({
  type: DELETE_PROJECT_CONTRACTOR,
  payload: ProjectContractor,
});

export const getProjectContractorSuccess = (ProjectContractors) => ({
  type: GET_PROJECT_CONTRACTOR_SUCCESS,
  payload: ProjectContractors,
});

export const getProjectContractorFail = (error) => ({
  type: GET_PROJECT_CONTRACTOR_FAIL,
  payload: error,
});

export const addProjectContractorSuccess = (ProjectContractor) => ({
  type: ADD_PROJECT_CONTRACTOR_SUCCESS,
  payload: ProjectContractor,
});

export const addProjectContractorFail = (error) => ({
  type: ADD_PROJECT_CONTRACTOR_FAIL,
  payload: error,
});

export const updateProjectContractorSuccess = (ProjectContractor) => ({
  type: UPDATE_PROJECT_CONTRACTOR_SUCCESS,
  payload: ProjectContractor,
});

export const updateProjectContractorFail = (error) => ({
  type: UPDATE_PROJECT_CONTRACTOR_FAIL,
  payload: error,
});

export const deleteProjectContractorSuccess = (ProjectContractor) => ({
  type: DELETE_PROJECT_CONTRACTOR_SUCCESS,
  payload: ProjectContractor,
});

export const deleteProjectContractorFail = (error) => ({
  type: DELETE_PROJECT_CONTRACTOR_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
