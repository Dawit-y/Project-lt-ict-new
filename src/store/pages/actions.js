import {
  GET_PAGES,
  GET_PAGES_FAIL,
  GET_PAGES_SUCCESS,
  ADD_PAGES,
  ADD_PAGES_SUCCESS,
  ADD_PAGES_FAIL,
  UPDATE_PAGES,
  UPDATE_PAGES_SUCCESS,
  UPDATE_PAGES_FAIL,
  DELETE_PAGES,
  DELETE_PAGES_SUCCESS,
  DELETE_PAGES_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getPages = () => ({
  type: GET_PAGES,
});
export const addPages = (Pages) => ({
  type: ADD_PAGES,
  payload: Pages,
});
export const updatePages = (Pages) => ({
  type: UPDATE_PAGES,
  payload: Pages,
});
export const deletePages = (Pages) => ({
  type: DELETE_PAGES,
  payload: Pages,
});

export const getPagesSuccess = (Pagess) => ({
  type: GET_PAGES_SUCCESS,
  payload: Pagess,
});

export const getPagesFail = (error) => ({
  type: GET_PAGES_FAIL,
  payload: error,
});

export const addPagesSuccess = (Pages) => ({
  type: ADD_PAGES_SUCCESS,
  payload: Pages,
});

export const addPagesFail = (error) => ({
  type: ADD_PAGES_FAIL,
  payload: error,
});

export const updatePagesSuccess = (Pages) => ({
  type: UPDATE_PAGES_SUCCESS,
  payload: Pages,
});

export const updatePagesFail = (error) => ({
  type: UPDATE_PAGES_FAIL,
  payload: error,
});

export const deletePagesSuccess = (Pages) => ({
  type: DELETE_PAGES_SUCCESS,
  payload: Pages,
});

export const deletePagesFail = (error) => ({
  type: DELETE_PAGES_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
