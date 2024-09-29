import {
  GET_DEPARTMENT,
  GET_DEPARTMENT_FAIL,
  GET_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FAIL,
  UPDATE_DEPARTMENT,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FAIL,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getDepartment = () => ({
  type: GET_DEPARTMENT,
});
export const addDepartment = (Department) => ({
  type: ADD_DEPARTMENT,
  payload: Department,
});
export const updateDepartment = (Department) => ({
  type: UPDATE_DEPARTMENT,
  payload: Department,
});
export const deleteDepartment = (Department) => ({
  type: DELETE_DEPARTMENT,
  payload: Department,
});

export const getDepartmentSuccess = (Departments) => ({
  type: GET_DEPARTMENT_SUCCESS,
  payload: Departments,
});

export const getDepartmentFail = (error) => ({
  type: GET_DEPARTMENT_FAIL,
  payload: error,
});

export const addDepartmentSuccess = (Department) => ({
  type: ADD_DEPARTMENT_SUCCESS,
  payload: Department,
});

export const addDepartmentFail = (error) => ({
  type: ADD_DEPARTMENT_FAIL,
  payload: error,
});

export const updateDepartmentSuccess = (Department) => ({
  type: UPDATE_DEPARTMENT_SUCCESS,
  payload: Department,
});

export const updateDepartmentFail = (error) => ({
  type: UPDATE_DEPARTMENT_FAIL,
  payload: error,
});

export const deleteDepartmentSuccess = (Department) => ({
  type: DELETE_DEPARTMENT_SUCCESS,
  payload: Department,
});

export const deleteDepartmentFail = (error) => ({
  type: DELETE_DEPARTMENT_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
