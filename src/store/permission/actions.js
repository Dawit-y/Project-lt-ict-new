import {
  GET_PERMISSION,
  GET_PERMISSION_FAIL,
  GET_PERMISSION_SUCCESS,
  ADD_PERMISSION,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAIL,
  UPDATE_PERMISSION,
  UPDATE_PERMISSION_SUCCESS,
  UPDATE_PERMISSION_FAIL,
  DELETE_PERMISSION,
  DELETE_PERMISSION_SUCCESS,
  DELETE_PERMISSION_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getPermission = (permissionroleid) => ({
  type: GET_PERMISSION,
  payload:permissionroleid,
});
export const addPermission = (Permission) => ({
  type: ADD_PERMISSION,
  payload: Permission,
});
export const updatePermission = (Permission) => ({
  type: UPDATE_PERMISSION,
  payload: Permission,
});
export const deletePermission = (Permission) => ({
  type: DELETE_PERMISSION,
  payload: Permission,
});

export const getPermissionSuccess = (Permissions) => ({
  type: GET_PERMISSION_SUCCESS,
  payload: Permissions,
});

export const getPermissionFail = (error) => ({
  type: GET_PERMISSION_FAIL,
  payload: error,
});

export const addPermissionSuccess = (Permission) => ({
  type: ADD_PERMISSION_SUCCESS,
  payload: Permission,
});

export const addPermissionFail = (error) => ({
  type: ADD_PERMISSION_FAIL,
  payload: error,
});

export const updatePermissionSuccess = (Permission) => ({
  type: UPDATE_PERMISSION_SUCCESS,
  payload: Permission,
});

export const updatePermissionFail = (error) => ({
  type: UPDATE_PERMISSION_FAIL,
  payload: error,
});

export const deletePermissionSuccess = (Permission) => ({
  type: DELETE_PERMISSION_SUCCESS,
  payload: Permission,
});

export const deletePermissionFail = (error) => ({
  type: DELETE_PERMISSION_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
