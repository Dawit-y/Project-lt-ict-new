import {
  GET_BUDGET_YEAR,
  GET_BUDGET_YEAR_FAIL,
  GET_BUDGET_YEAR_SUCCESS,
  ADD_BUDGET_YEAR,
  ADD_BUDGET_YEAR_SUCCESS,
  ADD_BUDGET_YEAR_FAIL,
  UPDATE_BUDGET_YEAR,
  UPDATE_BUDGET_YEAR_SUCCESS,
  UPDATE_BUDGET_YEAR_FAIL,
  DELETE_BUDGET_YEAR,
  DELETE_BUDGET_YEAR_SUCCESS,
  DELETE_BUDGET_YEAR_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getBudgetYear = () => ({
  type: GET_BUDGET_YEAR,
});
export const addBudgetYear = (BudgetYear) => ({
  type: ADD_BUDGET_YEAR,
  payload: BudgetYear,
});
export const updateBudgetYear = (BudgetYear) => ({
  type: UPDATE_BUDGET_YEAR,
  payload: BudgetYear,
});
export const deleteBudgetYear = (BudgetYear) => ({
  type: DELETE_BUDGET_YEAR,
  payload: BudgetYear,
});

export const getBudgetYearSuccess = (BudgetYears) => ({
  type: GET_BUDGET_YEAR_SUCCESS,
  payload: BudgetYears,
});

export const getBudgetYearFail = (error) => ({
  type: GET_BUDGET_YEAR_FAIL,
  payload: error,
});

export const addBudgetYearSuccess = (BudgetYear) => ({
  type: ADD_BUDGET_YEAR_SUCCESS,
  payload: BudgetYear,
});

export const addBudgetYearFail = (error) => ({
  type: ADD_BUDGET_YEAR_FAIL,
  payload: error,
});

export const updateBudgetYearSuccess = (BudgetYear) => ({
  type: UPDATE_BUDGET_YEAR_SUCCESS,
  payload: BudgetYear,
});

export const updateBudgetYearFail = (error) => ({
  type: UPDATE_BUDGET_YEAR_FAIL,
  payload: error,
});

export const deleteBudgetYearSuccess = (BudgetYear) => ({
  type: DELETE_BUDGET_YEAR_SUCCESS,
  payload: BudgetYear,
});

export const deleteBudgetYearFail = (error) => ({
  type: DELETE_BUDGET_YEAR_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
