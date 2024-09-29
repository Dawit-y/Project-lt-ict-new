import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_SECTOR_INFORMATION = "sector_information/listgrid";
const ADD_SECTOR_INFORMATION = "sector_information/insertgrid";
const UPDATE_SECTOR_INFORMATION = "sector_information/updategrid";
const DELETE_SECTOR_INFORMATION = "sector_information/deletegrid";
// get Projects
export const getSectorInformation = async () => {
  try {
    const response = await post(apiUrl+GET_SECTOR_INFORMATION);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addSectorInformation = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_SECTOR_INFORMATION,
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
export const updateSectorInformation = (objectName) =>
  post(`${apiUrl}`+UPDATE_SECTOR_INFORMATION +`?sci_id=${objectName?.sci_id}`, objectName);

// delete objectNames
export const deleteSectorInformation = (objectName) =>
  // post(`${url.DELETE_ORDER}?sci_id=${order?.sci_id}`);
  post(`${apiUrl}`+DELETE_SECTOR_INFORMATION+`?sci_id=${objectName}`);

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
    `${apiUrl}sector_information/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
