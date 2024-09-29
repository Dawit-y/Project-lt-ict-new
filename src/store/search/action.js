import {
  PERFORM_SEARCH_REQUEST,
  PERFORM_SEARCH_SUCCESS,
  PERFORM_SEARCH_FAIL,
  UPDATE_SEARCH_RESULTS,
  DELETE_SEARCH_RESULT
} from "./actionTypes";

export const performSearchRequest = (payload) => ({
  type: PERFORM_SEARCH_REQUEST,
  payload,
});

export const performSearchSuccess = (data) => ({
  type: PERFORM_SEARCH_SUCCESS,
  payload: data,
});

export const performSearchFail = (error) => ({
  type: PERFORM_SEARCH_FAIL,
  payload: error,
});

export const updateSearchResults = (updatedProject) => ({
  type: UPDATE_SEARCH_RESULTS,
  payload: updatedProject,
});

export const deleteSearchResult = (prs_id) => ({
  type: DELETE_SEARCH_RESULT,
  payload: prs_id,
});