import {
  GET_BUDGET_SOURCE,
  GET_BUDGET_SOURCE_FAIL,
  GET_BUDGET_SOURCE_SUCCESS,
  ADD_BUDGET_SOURCE,
  ADD_BUDGET_SOURCE_SUCCESS,
  ADD_BUDGET_SOURCE_FAIL,
  UPDATE_BUDGET_SOURCE,
  UPDATE_BUDGET_SOURCE_SUCCESS,
  UPDATE_BUDGET_SOURCE_FAIL,
  DELETE_BUDGET_SOURCE,
  DELETE_BUDGET_SOURCE_SUCCESS,
  DELETE_BUDGET_SOURCE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getBudgetSource = () => ({
  type: GET_BUDGET_SOURCE,
});
export const addBudgetSource = (BudgetSource) => ({
  type: ADD_BUDGET_SOURCE,
  payload: BudgetSource,
});
export const updateBudgetSource = (BudgetSource) => ({
  type: UPDATE_BUDGET_SOURCE,
  payload: BudgetSource,
});
export const deleteBudgetSource = (BudgetSource) => ({
  type: DELETE_BUDGET_SOURCE,
  payload: BudgetSource,
});

export const getBudgetSourceSuccess = (BudgetSources) => ({
  type: GET_BUDGET_SOURCE_SUCCESS,
  payload: BudgetSources,
});

export const getBudgetSourceFail = (error) => ({
  type: GET_BUDGET_SOURCE_FAIL,
  payload: error,
});

export const addBudgetSourceSuccess = (BudgetSource) => ({
  type: ADD_BUDGET_SOURCE_SUCCESS,
  payload: BudgetSource,
});

export const addBudgetSourceFail = (error) => ({
  type: ADD_BUDGET_SOURCE_FAIL,
  payload: error,
});

export const updateBudgetSourceSuccess = (BudgetSource) => ({
  type: UPDATE_BUDGET_SOURCE_SUCCESS,
  payload: BudgetSource,
});

export const updateBudgetSourceFail = (error) => ({
  type: UPDATE_BUDGET_SOURCE_FAIL,
  payload: error,
});

export const deleteBudgetSourceSuccess = (BudgetSource) => ({
  type: DELETE_BUDGET_SOURCE_SUCCESS,
  payload: BudgetSource,
});

export const deleteBudgetSourceFail = (error) => ({
  type: DELETE_BUDGET_SOURCE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
