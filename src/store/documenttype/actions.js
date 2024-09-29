import {
  GET_DOCUMENT_TYPE,
  GET_DOCUMENT_TYPE_FAIL,
  GET_DOCUMENT_TYPE_SUCCESS,
  ADD_DOCUMENT_TYPE,
  ADD_DOCUMENT_TYPE_SUCCESS,
  ADD_DOCUMENT_TYPE_FAIL,
  UPDATE_DOCUMENT_TYPE,
  UPDATE_DOCUMENT_TYPE_SUCCESS,
  UPDATE_DOCUMENT_TYPE_FAIL,
  DELETE_DOCUMENT_TYPE,
  DELETE_DOCUMENT_TYPE_SUCCESS,
  DELETE_DOCUMENT_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getDocumentType = () => ({
  type: GET_DOCUMENT_TYPE,
});
export const addDocumentType = (DocumentType) => ({
  type: ADD_DOCUMENT_TYPE,
  payload: DocumentType,
});
export const updateDocumentType = (DocumentType) => ({
  type: UPDATE_DOCUMENT_TYPE,
  payload: DocumentType,
});
export const deleteDocumentType = (DocumentType) => ({
  type: DELETE_DOCUMENT_TYPE,
  payload: DocumentType,
});

export const getDocumentTypeSuccess = (DocumentTypes) => ({
  type: GET_DOCUMENT_TYPE_SUCCESS,
  payload: DocumentTypes,
});

export const getDocumentTypeFail = (error) => ({
  type: GET_DOCUMENT_TYPE_FAIL,
  payload: error,
});

export const addDocumentTypeSuccess = (DocumentType) => ({
  type: ADD_DOCUMENT_TYPE_SUCCESS,
  payload: DocumentType,
});

export const addDocumentTypeFail = (error) => ({
  type: ADD_DOCUMENT_TYPE_FAIL,
  payload: error,
});

export const updateDocumentTypeSuccess = (DocumentType) => ({
  type: UPDATE_DOCUMENT_TYPE_SUCCESS,
  payload: DocumentType,
});

export const updateDocumentTypeFail = (error) => ({
  type: UPDATE_DOCUMENT_TYPE_FAIL,
  payload: error,
});

export const deleteDocumentTypeSuccess = (DocumentType) => ({
  type: DELETE_DOCUMENT_TYPE_SUCCESS,
  payload: DocumentType,
});

export const deleteDocumentTypeFail = (error) => ({
  type: DELETE_DOCUMENT_TYPE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
