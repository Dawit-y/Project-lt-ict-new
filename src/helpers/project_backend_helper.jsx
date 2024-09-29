import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT = "project/listgrid";
const ADD_PROJECT = "project/insertgrid";
const UPDATE_PROJECT = "project/updategrid";
const DELETE_PROJECT = "project/deletegrid";
// get Projects
export const getProject = async () => {
  try {
    const response = await post(apiUrl+GET_PROJECT);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addProject = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT,
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
export const updateProject = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT +`?prj_id=${objectName?.prj_id}`, objectName);

// delete objectNames
export const deleteProject = (objectName) =>
  // post(`${url.DELETE_ORDER}?prj_id=${order?.prj_id}`);
  post(`${apiUrl}`+DELETE_PROJECT+`?prj_id=${objectName}`);

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
    `${apiUrl}project/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
