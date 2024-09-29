import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PAGES = "/pages/listgrid";
const ADD_PAGES = "pages/insertgrid";
const UPDATE_PAGES = "pages/updategrid";
const DELETE_PAGES = "pages/deletegrid";
// get Projects
export const getPages = async () => {
  try {
    const response = await post(apiUrl+GET_PAGES);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addPages = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PAGES,
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
export const updatePages = (objectName) =>
  post(`${apiUrl}`+UPDATE_PAGES +`?pag_id=${objectName?.pag_id}`, objectName);

// delete objectNames
export const deletePages = (objectName) =>
  // post(`${url.DELETE_ORDER}?pag_id=${order?.pag_id}`);
  post(`${apiUrl}`+DELETE_PAGES+`?pag_id=${objectName}`);

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
    `${apiUrl}pages/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
