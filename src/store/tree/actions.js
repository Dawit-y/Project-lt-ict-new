// src/redux/actions.js
import {
    FETCH_PROJECTS_REQUEST,
    FETCH_PROJECTS_SUCCESS,
    FETCH_PROJECTS_FAILURE,
    DELETE_FOLDER_REQUEST,
    DELETE_FOLDER_SUCCESS,
    DELETE_FOLDER_FAILURE,
    ADD_FOLDER_REQUEST,
    ADD_FOLDER_SUCCESS,
    ADD_FOLDER_FAILURE,
    RENAME_FOLDER_REQUEST,
    RENAME_FOLDER_SUCCESS,
    RENAME_FOLDER_FAILURE,
  } from "./actionTypes";
  
  // Simple action creators returning action objects
  export const fetchProjectsRequest = () => ({
    type: FETCH_PROJECTS_REQUEST,
  });
  
  export const fetchProjectsSuccess = (data) => ({
    type: FETCH_PROJECTS_SUCCESS,
    payload: data,
  });
  
  export const fetchProjectsFailure = (error) => ({
    type: FETCH_PROJECTS_FAILURE,
    payload: error,
  });
  
  export const deleteFolderRequest = (id) => ({
    type: DELETE_FOLDER_REQUEST,
    payload: id,
  });
  
  export const deleteFolderSuccess = (id) => ({
    type: DELETE_FOLDER_SUCCESS,
    payload: id,
  });
  
  export const deleteFolderFailure = (error) => ({
    type: DELETE_FOLDER_FAILURE,
    payload: error,
  });
  
  export const addFolderRequest = (rootId, name) => ({
    type: ADD_FOLDER_REQUEST,
    payload: { rootId, name },
  });
  
  export const addFolderSuccess = (folder) => ({
    type: ADD_FOLDER_SUCCESS,
    payload: folder,
  });
  
  export const addFolderFailure = (error) => ({
    type: ADD_FOLDER_FAILURE,
    payload: error,
  });
  
  export const renameFolderRequest = (id, rootId, name) => ({
    type: RENAME_FOLDER_REQUEST,
    payload: { id, rootId, name },
  });
  
  export const renameFolderSuccess = (folder) => ({
    type: RENAME_FOLDER_SUCCESS,
    payload: folder,
  });
  
  export const renameFolderFailure = (error) => ({
    type: RENAME_FOLDER_FAILURE,
    payload: error,
  });
  