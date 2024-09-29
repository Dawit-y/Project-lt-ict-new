import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USER_ROLE = "user_role/listgrid";
const ADD_USER_ROLE = "user_role/insertgrid";
const UPDATE_USER_ROLE = "user_role/updategrid";
const DELETE_USER_ROLE = "user_role/deletegrid";
// get Projects
export const getUserRole = async () => {
  try {
    const response = await post(GET_USER_ROLE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addUserRole = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_USER_ROLE,
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
export const updateUserRole = (objectName) =>
  post(`${apiUrl}`+UPDATE_USER_ROLE +`?url_id=${objectName?.url_id}`, objectName);

// delete objectNames
export const deleteUserRole = (objectName) =>
  // post(`${url.DELETE_ORDER}?url_id=${order?.url_id}`);
  post(`${apiUrl}`+DELETE_USER_ROLE+`?url_id=${objectName}`);

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
    `${apiUrl}user_role/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
