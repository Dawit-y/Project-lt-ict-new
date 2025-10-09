import { del, get, post } from "./api_Lists";

const GET_PERMISSION = "permission/listgrid";
const ADD_PERMISSION = "permission/insertgrid";
const UPDATE_PERMISSION = "permission/updategrid";
const DELETE_PERMISSION = "permission/deletegrid";
const GET_ROLE_ASSIGNED_PERMISSION = "permission/listroleassignedpermission";
const GET_USER_ASSIGNED_PERMISSION = "permission/listuserassignedpermission";

export const getPermission = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PERMISSION}?${queryString}` : GET_PERMISSION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRoleAssignedPermission = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_ROLE_ASSIGNED_PERMISSION}?${queryString}`
    : GET_PERMISSION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getUserAssignedPermission = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_USER_ASSIGNED_PERMISSION}?${queryString}`
    : GET_PERMISSION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAssignedPermission = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_ROLE_ASSIGNED_PERMISSION}?${queryString}`
    : GET_PERMISSION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addPermission = async (objectName) =>
  post(ADD_PERMISSION, objectName);

export const updatePermission = (objectName) =>
  post(UPDATE_PERMISSION + `?pem_id=${objectName?.pem_id}`, objectName);

// delete objectNames
export const deletePermission = (objectName) =>
  post(DELETE_PERMISSION + `?pem_id=${objectName}`);
