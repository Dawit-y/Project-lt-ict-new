import { del, get, post, put } from "./api_Lists";
const GET_ROLES = "roles/listgrid";
const ADD_ROLES = "roles/insertgrid";
const UPDATE_ROLES = "roles/updategrid";
const DELETE_ROLES = "roles/deletegrid";

// get roles
export const getRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_ROLES}?${queryString}` : GET_ROLES;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};
// add Role
export const addRoles = async (objectName) => await post(ADD_ROLES, objectName);
// update objectNames
export const updateRoles = async (objectName) =>
  await post(UPDATE_ROLES + `?rol_id=${objectName?.rol_id}`, objectName);

// delete objectNames
export const deleteRoles = async (objectName) => {
  try {
    const response = await post(DELETE_ROLES + `?rol_id=${objectName}`);
    return response;
  } catch (error) {
    throw error;
  }
};
