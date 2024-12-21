import { del, get, post } from "./api_Lists";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PERMISSION = "permission/listgrid";
const ADD_PERMISSION = "permission/insertgrid";
const UPDATE_PERMISSION = "permission/updategrid";
const DELETE_PERMISSION = "permission/deletegrid";

export const getPermission = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PERMISSION}?${queryString}` : GET_PERMISSION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

export const addPermission = async (objectName) =>
  post(`${apiUrl}` + ADD_PERMISSION, objectName);

export const updatePermission = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_PERMISSION + `?pem_id=${objectName?.pem_id}`,
    objectName
  );

// delete objectNames
export const deletePermission = (objectName) =>
  post(`${apiUrl}` + DELETE_PERMISSION + `?pem_id=${objectName}`);
