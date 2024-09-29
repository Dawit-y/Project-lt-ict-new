import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_STATUS = "project_status/listgrid";
const ADD_PROJECT_STATUS = "project_status/insertgrid";
const UPDATE_PROJECT_STATUS = "project_status/updategrid";
const DELETE_PROJECT_STATUS = "project_status/deletegrid";
// get Projects
export const getProjectStatus = async () => {
  try {
    const response = await post(apiUrl+GET_PROJECT_STATUS);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addProjectStatus = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_STATUS,
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
export const updateProjectStatus = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_STATUS +`?prs_id=${objectName?.prs_id}`, objectName);

// delete objectNames
export const deleteProjectStatus = (objectName) =>
  // post(`${url.DELETE_ORDER}?prs_id=${order?.prs_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_STATUS+`?prs_id=${objectName}`);

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
    `${apiUrl}project_status/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
