import {
  GET_PROJECT_STAKEHOLDER,
  GET_PROJECT_STAKEHOLDER_FAIL,
  GET_PROJECT_STAKEHOLDER_SUCCESS,
  ADD_PROJECT_STAKEHOLDER,
  ADD_PROJECT_STAKEHOLDER_SUCCESS,
  ADD_PROJECT_STAKEHOLDER_FAIL,
  UPDATE_PROJECT_STAKEHOLDER,
  UPDATE_PROJECT_STAKEHOLDER_SUCCESS,
  UPDATE_PROJECT_STAKEHOLDER_FAIL,
  DELETE_PROJECT_STAKEHOLDER,
  DELETE_PROJECT_STAKEHOLDER_SUCCESS,
  DELETE_PROJECT_STAKEHOLDER_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectStakeholder = (projectid) => ({
  type: GET_PROJECT_STAKEHOLDER,
  payload:projectid
});
export const addProjectStakeholder = (ProjectStakeholder) => ({
  type: ADD_PROJECT_STAKEHOLDER,
  payload: ProjectStakeholder,
});
export const updateProjectStakeholder = (ProjectStakeholder) => ({
  type: UPDATE_PROJECT_STAKEHOLDER,
  payload: ProjectStakeholder,
});
export const deleteProjectStakeholder = (ProjectStakeholder) => ({
  type: DELETE_PROJECT_STAKEHOLDER,
  payload: ProjectStakeholder,
});

export const getProjectStakeholderSuccess = (ProjectStakeholders) => ({
  type: GET_PROJECT_STAKEHOLDER_SUCCESS,
  payload: ProjectStakeholders,
});

export const getProjectStakeholderFail = (error) => ({
  type: GET_PROJECT_STAKEHOLDER_FAIL,
  payload: error,
});

export const addProjectStakeholderSuccess = (ProjectStakeholder) => ({
  type: ADD_PROJECT_STAKEHOLDER_SUCCESS,
  payload: ProjectStakeholder,
});

export const addProjectStakeholderFail = (error) => ({
  type: ADD_PROJECT_STAKEHOLDER_FAIL,
  payload: error,
});

export const updateProjectStakeholderSuccess = (ProjectStakeholder) => ({
  type: UPDATE_PROJECT_STAKEHOLDER_SUCCESS,
  payload: ProjectStakeholder,
});

export const updateProjectStakeholderFail = (error) => ({
  type: UPDATE_PROJECT_STAKEHOLDER_FAIL,
  payload: error,
});

export const deleteProjectStakeholderSuccess = (ProjectStakeholder) => ({
  type: DELETE_PROJECT_STAKEHOLDER_SUCCESS,
  payload: ProjectStakeholder,
});

export const deleteProjectStakeholderFail = (error) => ({
  type: DELETE_PROJECT_STAKEHOLDER_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
