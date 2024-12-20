import { post } from "./api_Lists";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USERS = "users/listgrid";
const ADD_USERS = "users/insertgrid";
const UPDATE_USERS = "users/updategrid";
const DELETE_USERS = "users/deletegrid";
// get users
export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_USERS}?${queryString}` : GET_USERS;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add users
export const addUsers = async (objectName) => {
  try {
    const response = await axios.post(`${apiUrl}` + ADD_USERS, objectName, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};

// update users
export const updateUsers = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_USERS + `?usr_id=${objectName?.usr_id}`,
    objectName
  );

// delete  users
export const deleteUsers = (objectName) =>
  post(`${apiUrl}` + DELETE_USERS + `?usr_id=${objectName}`);
