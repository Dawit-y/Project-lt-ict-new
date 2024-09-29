import {
  GET_PROJECT_DOCUMENT,
  GET_PROJECT_DOCUMENT_FAIL,
  GET_PROJECT_DOCUMENT_SUCCESS,
  ADD_PROJECT_DOCUMENT,
  ADD_PROJECT_DOCUMENT_SUCCESS,
  ADD_PROJECT_DOCUMENT_FAIL,
  UPDATE_PROJECT_DOCUMENT,
  UPDATE_PROJECT_DOCUMENT_SUCCESS,
  UPDATE_PROJECT_DOCUMENT_FAIL,
  DELETE_PROJECT_DOCUMENT,
  DELETE_PROJECT_DOCUMENT_SUCCESS,
  DELETE_PROJECT_DOCUMENT_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectDocument = (projectId) => ({
  type: GET_PROJECT_DOCUMENT,
  payload:projectId
  
});
export const addProjectDocument = (ProjectDocument) => ({
  type: ADD_PROJECT_DOCUMENT,
  payload: ProjectDocument,
});
export const updateProjectDocument = (ProjectDocument) => ({
  type: UPDATE_PROJECT_DOCUMENT,
  payload: ProjectDocument,
});
export const deleteProjectDocument = (ProjectDocument) => ({
  type: DELETE_PROJECT_DOCUMENT,
  payload: ProjectDocument,
});

export const getProjectDocumentSuccess = (ProjectDocuments) => ({
  type: GET_PROJECT_DOCUMENT_SUCCESS,
  payload: ProjectDocuments,
});

export const getProjectDocumentFail = (error) => ({
  type: GET_PROJECT_DOCUMENT_FAIL,
  payload: error,
});

export const addProjectDocumentSuccess = (ProjectDocument) => ({
  type: ADD_PROJECT_DOCUMENT_SUCCESS,
  payload: ProjectDocument,
});

export const addProjectDocumentFail = (error) => ({
  type: ADD_PROJECT_DOCUMENT_FAIL,
  payload: error,
});

export const updateProjectDocumentSuccess = (ProjectDocument) => ({
  type: UPDATE_PROJECT_DOCUMENT_SUCCESS,
  payload: ProjectDocument,
});

export const updateProjectDocumentFail = (error) => ({
  type: UPDATE_PROJECT_DOCUMENT_FAIL,
  payload: error,
});

export const deleteProjectDocumentSuccess = (ProjectDocument) => ({
  type: DELETE_PROJECT_DOCUMENT_SUCCESS,
  payload: ProjectDocument,
});

export const deleteProjectDocumentFail = (error) => ({
  type: DELETE_PROJECT_DOCUMENT_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
