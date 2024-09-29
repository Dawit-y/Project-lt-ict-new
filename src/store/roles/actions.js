import {
  GET_ROLES,
  GET_ROLES_FAIL,
  GET_ROLES_SUCCESS,
  ADD_ROLES,
  ADD_ROLES_SUCCESS,
  ADD_ROLES_FAIL,
  UPDATE_ROLES,
  UPDATE_ROLES_SUCCESS,
  UPDATE_ROLES_FAIL,
  DELETE_ROLES,
  DELETE_ROLES_SUCCESS,
  DELETE_ROLES_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getRoles = () => ({
  type: GET_ROLES,
});
export const addRoles = (Roles) => ({
  type: ADD_ROLES,
  payload: Roles,
});
export const updateRoles = (Roles) => ({
  type: UPDATE_ROLES,
  payload: Roles,
});
export const deleteRoles = (Roles) => ({
  type: DELETE_ROLES,
  payload: Roles,
});

export const getRolesSuccess = (Roless) => ({
  type: GET_ROLES_SUCCESS,
  payload: Roless,
});

export const getRolesFail = (error) => ({
  type: GET_ROLES_FAIL,
  payload: error,
});

export const addRolesSuccess = (Roles) => ({
  type: ADD_ROLES_SUCCESS,
  payload: Roles,
});

export const addRolesFail = (error) => ({
  type: ADD_ROLES_FAIL,
  payload: error,
});

export const updateRolesSuccess = (Roles) => ({
  type: UPDATE_ROLES_SUCCESS,
  payload: Roles,
});

export const updateRolesFail = (error) => ({
  type: UPDATE_ROLES_FAIL,
  payload: error,
});

export const deleteRolesSuccess = (Roles) => ({
  type: DELETE_ROLES_SUCCESS,
  payload: Roles,
});

export const deleteRolesFail = (error) => ({
  type: DELETE_ROLES_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
