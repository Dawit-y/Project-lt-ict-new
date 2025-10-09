import { post } from "./api_Lists";

const GET_USER_SECTOR = "user_sector/listgrid";
const ADD_USER_SECTOR = "user_sector/insertgrid";
const UPDATE_USER_SECTOR = "user_sector/updategrid";
const DELETE_USER_SECTOR = "user_sector/deletegrid";
const GET_USER_SECTOR_TREE = "user_sector/listgridtree";
// get user_sector
export const getUserSector = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_USER_SECTOR}?${queryString}`
    : GET_USER_SECTOR;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserSectorTree = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_USER_SECTOR_TREE}?${queryString}`
    : GET_USER_SECTOR_TREE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add user_sector
export const addUserSector = async (objectName) =>
  post(ADD_USER_SECTOR, objectName);

// update user_sector
export const updateUserSector = async (objectName) =>
  post(UPDATE_USER_SECTOR, objectName);

// delete  user_sector
export const deleteUserSector = async (objectName) =>
  post(DELETE_USER_SECTOR + `?usc_id=${objectName}`);
