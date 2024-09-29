import {
  GET_PROJECTS_STATUS,
  GET_PROJECTS_STATUS_FAIL,
  GET_PROJECTS_STATUS_SUCCESS,
  ADD_NEW_PROJECT_STATUS,
  ADD_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_FAIL,
  UPDATE_PROJECT_STATUS,
  UPDATE_PROJECT_STATUS_SUCCESS,
  UPDATE_PROJECT_STATUS_FAIL,
  DELETE_PROJECT_STATUS,
  DELETE_PROJECT_STATUS_SUCCESS,
  DELETE_PROJECT_STATUS_FAIL,
  TOGGLE_UPDATE_LOADING,
  TOGGLE_SHOW_RESULT,
} from "./actionTypes";

export const getProjectsStatus = () => ({
  type: GET_PROJECTS_STATUS,
});
export const addNewProjectStatus = (PROJECT) => ({
  type: ADD_NEW_PROJECT_STATUS,
  payload: PROJECT,
});
export const updateProjectStatus = (PROJECT) => ({
  type: UPDATE_PROJECT_STATUS,
  payload: PROJECT,
});
export const deleteProjectStatus = (PROJECT) => ({
  type: DELETE_PROJECT_STATUS,
  payload: PROJECT,
});

export const getProjectsSuccess = (PROJECTs) => ({
  type: GET_PROJECTS_STATUS_SUCCESS,
  payload: PROJECTs,
});

export const getProjectsFail = (error) => ({
  type: GET_PROJECTS_STATUS_FAIL,
  payload: error,
});

export const addProjectSuccess = (PROJECT) => ({
  type: ADD_PROJECT_STATUS_SUCCESS,
  payload: PROJECT,
});

export const addProjectFail = (error) => ({
  type: ADD_PROJECT_STATUS_FAIL,
  payload: error,
});

export const updateProjectSuccess = (PROJECT) => ({
  type: UPDATE_PROJECT_STATUS_SUCCESS,
  payload: PROJECT,
});

export const updateProjectFail = (error) => ({
  type: UPDATE_PROJECT_STATUS_FAIL,
  payload: error,
});

export const deleteProjectuccess = (PROJECT) => ({
  type: DELETE_PROJECT_STATUS_SUCCESS,
  payload: PROJECT,
});

export const deleteProjectfail = (error) => ({
  type: DELETE_PROJECT_STATUS_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});

export const toggleShowResult = (value) => ({
  type: TOGGLE_SHOW_RESULT,
  payload: value,
});
