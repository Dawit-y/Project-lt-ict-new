import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USER_ROLE = "user_role/listgrid";
const ADD_USER_ROLE = "user_role/insertgrid";
const UPDATE_USER_ROLE = "user_role/updategrid";
const DELETE_USER_ROLE = "user_role/deletegrid";

export const getUserRole = async (param = {}) => {
  const queryString = new URLSearchParams(param).toString();
  const url = queryString ? `${GET_USER_ROLE}?${queryString}` : GET_USER_ROLE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};
// add Projects
export const addUserRole = async (objectName) =>
  await post(ADD_USER_ROLE, objectName);
// update objectNames
export const updateUserRole = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_USER_ROLE + `?url_id=${objectName?.url_id}`,
    objectName
  );

// delete objectNames
export const deleteUserRole = (objectName) =>
  post(`${apiUrl}` + DELETE_USER_ROLE + `?url_id=${objectName}`);
