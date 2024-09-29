import {
  GET_BUDGET_REQUEST,
  GET_BUDGET_REQUEST_FAIL,
  GET_BUDGET_REQUEST_SUCCESS,
  ADD_BUDGET_REQUEST,
  ADD_BUDGET_REQUEST_SUCCESS,
  ADD_BUDGET_REQUEST_FAIL,
  UPDATE_BUDGET_REQUEST,
  UPDATE_BUDGET_REQUEST_SUCCESS,
  UPDATE_BUDGET_REQUEST_FAIL,
  DELETE_BUDGET_REQUEST,
  DELETE_BUDGET_REQUEST_SUCCESS,
  DELETE_BUDGET_REQUEST_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getBudgetRequest = (projectid) => ({
  type: GET_BUDGET_REQUEST,
  payload:projectid
});
export const addBudgetRequest = (BudgetRequest) => ({
  type: ADD_BUDGET_REQUEST,
  payload: BudgetRequest,
});
export const updateBudgetRequest = (BudgetRequest) => ({
  type: UPDATE_BUDGET_REQUEST,
  payload: BudgetRequest,
});
export const deleteBudgetRequest = (BudgetRequest) => ({
  type: DELETE_BUDGET_REQUEST,
  payload: BudgetRequest,
});

export const getBudgetRequestSuccess = (BudgetRequests) => ({
  type: GET_BUDGET_REQUEST_SUCCESS,
  payload: BudgetRequests,
});

export const getBudgetRequestFail = (error) => ({
  type: GET_BUDGET_REQUEST_FAIL,
  payload: error,
});

export const addBudgetRequestSuccess = (BudgetRequest) => ({
  type: ADD_BUDGET_REQUEST_SUCCESS,
  payload: BudgetRequest,
});

export const addBudgetRequestFail = (error) => ({
  type: ADD_BUDGET_REQUEST_FAIL,
  payload: error,
});

export const updateBudgetRequestSuccess = (BudgetRequest) => ({
  type: UPDATE_BUDGET_REQUEST_SUCCESS,
  payload: BudgetRequest,
});

export const updateBudgetRequestFail = (error) => ({
  type: UPDATE_BUDGET_REQUEST_FAIL,
  payload: error,
});

export const deleteBudgetRequestSuccess = (BudgetRequest) => ({
  type: DELETE_BUDGET_REQUEST_SUCCESS,
  payload: BudgetRequest,
});

export const deleteBudgetRequestFail = (error) => ({
  type: DELETE_BUDGET_REQUEST_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
