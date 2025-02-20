import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_USER_SECTOR = "user_sector/listgrid";
const ADD_USER_SECTOR = "user_sector/insertgrid";
const UPDATE_USER_SECTOR = "user_sector/updategrid";
const DELETE_USER_SECTOR = "user_sector/deletegrid";
// get user_sector
export const getUserSector = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_USER_SECTOR}?${queryString}` : GET_USER_SECTOR;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add user_sector
export const addUserSector = async (objectName) =>
  post(`${apiUrl}` + ADD_USER_SECTOR, objectName);

// update user_sector
export const updateUserSector = (objectName) =>
post(`${apiUrl}`+UPDATE_USER_SECTOR +`?usc_id=${objectName?.usc_id}`, objectName);

// delete  user_sector
export const deleteUserSector = (objectName) =>
  post(`${apiUrl}`+DELETE_USER_SECTOR+`?usc_id=${objectName}`);
