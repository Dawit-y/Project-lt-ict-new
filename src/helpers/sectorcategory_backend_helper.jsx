import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_SECTOR_CATEGORY = "sector_category/listgrid";
const ADD_SECTOR_CATEGORY = "sector_category/insertgrid";
const UPDATE_SECTOR_CATEGORY = "sector_category/updategrid";
const DELETE_SECTOR_CATEGORY = "sector_category/deletegrid";
// get Projects
export const getSectorCategory = async () => {
  try {
    const response = await post(apiUrl+GET_SECTOR_CATEGORY);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addSectorCategory = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_SECTOR_CATEGORY,
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
export const updateSectorCategory = (objectName) =>
  post(`${apiUrl}`+UPDATE_SECTOR_CATEGORY +`?psc_delete_time=${objectName?.psc_delete_time}`, objectName);

// delete objectNames
export const deleteSectorCategory = (objectName) =>
  // post(`${url.DELETE_ORDER}?psc_delete_time=${order?.psc_delete_time}`);
  post(`${apiUrl}`+DELETE_SECTOR_CATEGORY+`?psc_delete_time=${objectName}`);

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
    `${apiUrl}sector_category/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
