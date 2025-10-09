import { post } from "./api_Lists";

const GET_USERS = "users/listgrid";
const ADD_USERS = "users/insertgrid";
const UPDATE_USERS = "users/updategrid";
const DELETE_USERS = "users/deletegrid";

export const getUsers = async () => {
  try {
    const response = await post(GET_USERS);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addUsers = async (data) =>
  post(ADD_USERS, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateUsers = async (data) =>
  post(UPDATE_USERS + `?usr_id=${data?.usr_id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUsers = (objectName) =>
  post(DELETE_USERS + `?usr_id=${objectName}`);
