import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_DOCUMENT = "project_document/listgrid";
const ADD_PROJECT_DOCUMENT = "project_document/insertgrid";
const UPDATE_PROJECT_DOCUMENT = "project_document/updategrid";
const DELETE_PROJECT_DOCUMENT = "project_document/deletegrid";
// get Projects
export const getProjectDocument = async (projectid) => {
  try {
    let response;
    if (projectid != null) {
      response = await post(`${GET_PROJECT_DOCUMENT}?project_id=${projectid}`);
    } else {
      response = await post(`${GET_PROJECT_DOCUMENT}`);
    }
    
    // console.log("Backend response:", response);
    return response;
  } catch (error) {
    console.log("Error:", error); // Handle any errors
  }
};

// add Projects
export const addProjectDocument = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_DOCUMENT,
      objectName,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};
// update objectNames
export const updateProjectDocument = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_DOCUMENT +`?prd_id=${objectName?.prd_id}`, objectName);

// delete objectNames
export const deleteProjectDocument = (objectName) =>
  // post(`${url.DELETE_ORDER}?prd_id=${order?.prd_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_DOCUMENT+`?prd_id=${objectName}`);

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
    `${apiUrl}project_document/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
