import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USERS = "users/listgrid";
const ADD_USERS = "users/insertgrid";
const UPDATE_USERS = "users/updategrid";
const DELETE_USERS = "users/deletegrid";
// get Projects
export const getUsers = async () => {
  try {
    const response = await post(GET_USERS);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addUsers = async (objectName) => {
  try {
    const response = await axios.post(`${apiUrl}` + ADD_USERS, objectName, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type for image upload
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};
// update objectNames
// export const updateUsers = (objectName) =>{

//   post(UPDATE_USERS +`?usr_id=${objectName?.usr_id}`, objectName);

// }
// Update Users
export const updateUsers = async (objectName) => {
  console.log("Updated data:", objectName);

  try {
    const response = await axios.post(
      `${apiUrl}${UPDATE_USERS}?usr_id=${objectName?.usr_id}`,
      objectName,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// delete objectNames
export const deleteUsers = (objectName) =>
  // post(`${url.DELETE_ORDER}?usr_id=${order?.usr_id}`);
  post(`${apiUrl}` + DELETE_USERS + `?usr_id=${objectName}`);

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
  const response = await axios.post(`${apiUrl}users/listgrid?${queryString}`);
  return response.data.data;
};
export {};
