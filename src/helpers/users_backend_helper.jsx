import { post } from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USERS = "users/listgrid";
const GET_USER = "users/getuserinfo";
const ADD_USERS = "users/insertgrid";
const UPDATE_USERS = "users/updategrid";
const DELETE_USERS = "users/deletegrid";
const UPDATE_USER_STATUS = "users/changeuserstatus";
const CHANGE_PASSWORD = "user/change_password";
const UPDATE_PROFILE = "users/updateprofile";

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

// get users
export const getUser = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_USER}?${queryString}` : GET_USER;
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
    const response = await post(ADD_USERS, objectName, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};

// update users
export const updateUsers = (objectName) =>
  post(UPDATE_USERS + `?usr_id=${objectName?.usr_id}`, objectName, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// update profile
export const updateProfile = (objectName) =>
  post(UPDATE_PROFILE + `?id=${objectName?.usr_id}`, objectName, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// change password
export const changeUserStatus = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_USER_STATUS + `?usr_id=${objectName?.usr_id}`,
    objectName
  );
// change password
export const changePassword = (objectName) =>
  post(
    `${apiUrl}` + CHANGE_PASSWORD + `?usr_id=${objectName?.user_id}`,
    objectName
  );
// delete  users
export const deleteUsers = (objectName) =>
  post(`${apiUrl}` + DELETE_USERS + `?usr_id=${objectName}`);
