import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_CONTRACTOR = "project_contractor/listgrid";
const ADD_PROJECT_CONTRACTOR = "project_contractor/insertgrid";
const UPDATE_PROJECT_CONTRACTOR = "project_contractor/updategrid";
const DELETE_PROJECT_CONTRACTOR = "project_contractor/deletegrid";
// get Projects
export const getProjectContractor = async (projectidContractor) => {
  try {
    // const response = await post(apiUrl+GET_PROJECT_CONTRACTOR);
    // return response;
    let response;
    if (projectidContractor != null) {
      response = await post(`${apiUrl}${GET_PROJECT_CONTRACTOR}?project_id=${projectidContractor}`);
    } else {
      response = await post(`${apiUrl}${GET_PROJECT_CONTRACTOR}`);
    }
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addProjectContractor = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_CONTRACTOR,
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
export const updateProjectContractor = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_CONTRACTOR +`?cni_id=${objectName?.cni_id}`, objectName);

// delete objectNames
export const deleteProjectContractor = (objectName) =>
  // post(`${url.DELETE_ORDER}?cni_id=${order?.cni_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_CONTRACTOR+`?cni_id=${objectName}`);

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
    `${apiUrl}project_contractor/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
