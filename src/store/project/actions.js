import {
  GET_PROJECT,
  GET_PROJECT_FAIL,
  GET_PROJECT_SUCCESS,
  ADD_PROJECT,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  UPDATE_PROJECT,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
  DELETE_PROJECT,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
  TOGGLE_UPDATE_LOADING,
  SELECT_PROJECT,
  FETCH_SINGLE_PROJECT_FAIL,
  FETCH_SINGLE_PROJECT_REQUEST,
  FETCH_SINGLE_PROJECT_SUCCESS,
} from "./actionTypes";

export const getProject = () => ({
  type: GET_PROJECT,
});
export const addProject = (Project) => ({
  type: ADD_PROJECT,
  payload: Project,
});
export const updateProject = (Project) => ({
  type: UPDATE_PROJECT,
  payload: Project,
});
export const deleteProject = (Project) => ({
  type: DELETE_PROJECT,
  payload: Project,
});

export const getProjectSuccess = (Projects) => ({
  type: GET_PROJECT_SUCCESS,
  payload: Projects,
});

export const getProjectFail = (error) => ({
  type: GET_PROJECT_FAIL,
  payload: error,
});

export const addProjectSuccess = (Project) => ({
  type: ADD_PROJECT_SUCCESS,
  payload: Project,
});

export const addProjectFail = (error) => ({
  type: ADD_PROJECT_FAIL,
  payload: error,
});

export const updateProjectSuccess = (Project) => ({
  type: UPDATE_PROJECT_SUCCESS,
  payload: Project,
});

export const updateProjectFail = (error) => ({
  type: UPDATE_PROJECT_FAIL,
  payload: error,
});

export const deleteProjectSuccess = (Project) => ({
  type: DELETE_PROJECT_SUCCESS,
  payload: Project,
});

export const deleteProjectFail = (error) => ({
  type: DELETE_PROJECT_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});

export const selectProject = (prj_id) => {
  return {
    type: SELECT_PROJECT,
    payload: prj_id,
  };
};

export const fetchSingleProjectRequest = (prj_id) => ({
  type: FETCH_SINGLE_PROJECT_REQUEST,
  payload: prj_id,
});

export const fetchSingleProjectSuccess = (project) => ({
  type: FETCH_SINGLE_PROJECT_SUCCESS,
  payload: project,
});

export const fetchSingleProjectFail = (error) => ({
  type: FETCH_SINGLE_PROJECT_FAIL,
  payload: error,
});
