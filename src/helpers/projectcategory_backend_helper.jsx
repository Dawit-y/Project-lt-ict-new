import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_CATEGORY = "project_category/listgrid";
const ADD_PROJECT_CATEGORY = "project_category/insertgrid";
const UPDATE_PROJECT_CATEGORY = "project_category/updategrid";
const DELETE_PROJECT_CATEGORY = "project_category/deletegrid";
// get Projects
export const getProjectCategory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_CATEGORY}?${queryString}` : GET_PROJECT_CATEGORY;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};
// add Projects
export const addProjectCategory = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_CATEGORY,
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
export const updateProjectCategory = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_CATEGORY +`?pct_id=${objectName?.pct_id}`, objectName);

// delete objectNames
export const deleteProjectCategory = (objectName) =>
  // post(`${url.DELETE_ORDER}?pct_id=${order?.pct_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_CATEGORY+`?pct_id=${objectName}`);

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
    `${apiUrl}project_category/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
