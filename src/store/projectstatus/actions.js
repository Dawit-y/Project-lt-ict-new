import {
  GET_PROJECT_STATUS,
  GET_PROJECT_STATUS_FAIL,
  GET_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS,
  ADD_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_FAIL,
  UPDATE_PROJECT_STATUS,
  UPDATE_PROJECT_STATUS_SUCCESS,
  UPDATE_PROJECT_STATUS_FAIL,
  DELETE_PROJECT_STATUS,
  DELETE_PROJECT_STATUS_SUCCESS,
  DELETE_PROJECT_STATUS_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectStatus = () => ({
  type: GET_PROJECT_STATUS,
});
export const addProjectStatus = (ProjectStatus) => ({
  type: ADD_PROJECT_STATUS,
  payload: ProjectStatus,
});
export const updateProjectStatus = (ProjectStatus) => ({
  type: UPDATE_PROJECT_STATUS,
  payload: ProjectStatus,
});
export const deleteProjectStatus = (ProjectStatus) => ({
  type: DELETE_PROJECT_STATUS,
  payload: ProjectStatus,
});

export const getProjectStatusSuccess = (ProjectStatuss) => ({
  type: GET_PROJECT_STATUS_SUCCESS,
  payload: ProjectStatuss,
});

export const getProjectStatusFail = (error) => ({
  type: GET_PROJECT_STATUS_FAIL,
  payload: error,
});

export const addProjectStatusSuccess = (ProjectStatus) => ({
  type: ADD_PROJECT_STATUS_SUCCESS,
  payload: ProjectStatus,
});

export const addProjectStatusFail = (error) => ({
  type: ADD_PROJECT_STATUS_FAIL,
  payload: error,
});

export const updateProjectStatusSuccess = (ProjectStatus) => ({
  type: UPDATE_PROJECT_STATUS_SUCCESS,
  payload: ProjectStatus,
});

export const updateProjectStatusFail = (error) => ({
  type: UPDATE_PROJECT_STATUS_FAIL,
  payload: error,
});

export const deleteProjectStatusSuccess = (ProjectStatus) => ({
  type: DELETE_PROJECT_STATUS_SUCCESS,
  payload: ProjectStatus,
});

export const deleteProjectStatusFail = (error) => ({
  type: DELETE_PROJECT_STATUS_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
