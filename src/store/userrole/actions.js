import {
  GET_USER_ROLE,
  GET_USER_ROLE_FAIL,
  GET_USER_ROLE_SUCCESS,
  ADD_USER_ROLE,
  ADD_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_FAIL,
  UPDATE_USER_ROLE,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
  DELETE_USER_ROLE,
  DELETE_USER_ROLE_SUCCESS,
  DELETE_USER_ROLE_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getUserRole = (UserRoleId) => ({
  type: GET_USER_ROLE,
  payload:UserRoleId
});
export const addUserRole = (UserRole) => ({
  type: ADD_USER_ROLE,
  payload: UserRole,
});
export const updateUserRole = (UserRole) => ({
  type: UPDATE_USER_ROLE,
  payload: UserRole,
});
export const deleteUserRole = (UserRole) => ({
  type: DELETE_USER_ROLE,
  payload: UserRole,
});

export const getUserRoleSuccess = (UserRoles) => ({
  type: GET_USER_ROLE_SUCCESS,
  payload: UserRoles,
});

export const getUserRoleFail = (error) => ({
  type: GET_USER_ROLE_FAIL,
  payload: error,
});

export const addUserRoleSuccess = (UserRole) => ({
  type: ADD_USER_ROLE_SUCCESS,
  payload: UserRole,
});

export const addUserRoleFail = (error) => ({
  type: ADD_USER_ROLE_FAIL,
  payload: error,
});

export const updateUserRoleSuccess = (UserRole) => ({
  type: UPDATE_USER_ROLE_SUCCESS,
  payload: UserRole,
});

export const updateUserRoleFail = (error) => ({
  type: UPDATE_USER_ROLE_FAIL,
  payload: error,
});

export const deleteUserRoleSuccess = (UserRole) => ({
  type: DELETE_USER_ROLE_SUCCESS,
  payload: UserRole,
});

export const deleteUserRoleFail = (error) => ({
  type: DELETE_USER_ROLE_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
