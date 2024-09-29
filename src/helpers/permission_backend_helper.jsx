import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PERMISSION = "permission/listgrid";
const ADD_PERMISSION = "permission/insertgrid";
const UPDATE_PERMISSION = "permission/updategrid";
const DELETE_PERMISSION = "permission/deletegrid";
// get Projects
export const getPermission = async (permissionroleid) => {
  try {
    const response = await post(`${apiUrl}${GET_PERMISSION}?pem_role_id=${permissionroleid}`);
  
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addPermission = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PERMISSION,
      objectName,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};
// update objectNames
export const updatePermission = (objectName) =>
  post(`${apiUrl}`+UPDATE_PERMISSION +`?pem_id=${objectName?.pem_id}`, objectName);

// delete objectNames
export const deletePermission = (objectName) =>
  // post(`${url.DELETE_ORDER}?pem_id=${order?.pem_id}`);
  post(`${apiUrl}`+DELETE_PERMISSION+`?pem_id=${objectName}`);

export const fetchSearchResults = async (searchTerm, selectedFields) => {
  let queryParams = [];
  if (searchTerm && searchTerm.search_en_value) {
    queryParams.push(
      `search_en_name=${encodeURIComponent(searchTerm.search_en_value)}`
    );
  }
  selectedFields.forEach((field) => {
    const [key] = Object.keys(field);
    const value = field[key];
    if (value !== undefined && value !== "") {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  const queryString = queryParams.join("&");
  const response = await axios.post(
    `${apiUrl}permission/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
