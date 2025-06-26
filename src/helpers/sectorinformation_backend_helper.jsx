import { post } from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_SECTOR_INFORMATION = "sector_information/listgrid";
const ADD_SECTOR_INFORMATION = "sector_information/insertgrid";
const UPDATE_SECTOR_INFORMATION = "sector_information/updategrid";
const DELETE_SECTOR_INFORMATION = "sector_information/deletegrid";
// get sector_information
export const getSectorInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_SECTOR_INFORMATION}?${queryString}` : GET_SECTOR_INFORMATION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add sector_information
export const addSectorInformation = async (objectName) =>
	post(ADD_SECTOR_INFORMATION, objectName);

// update sector_information
export const updateSectorInformation = (objectName) =>
	post(UPDATE_SECTOR_INFORMATION + `?sci_id=${objectName?.sci_id}`, objectName);

// delete  sector_information
export const deleteSectorInformation = (objectName) =>
	post(DELETE_SECTOR_INFORMATION + `?sci_id=${objectName}`);
