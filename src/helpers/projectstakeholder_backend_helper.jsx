import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_STAKEHOLDER = "project_stakeholder/listgrid";
const ADD_PROJECT_STAKEHOLDER = "project_stakeholder/insertgrid";
const UPDATE_PROJECT_STAKEHOLDER = "project_stakeholder/updategrid";
const DELETE_PROJECT_STAKEHOLDER = "project_stakeholder/deletegrid";
// get Projects
export const getProjectStakeholder = async (projectstakeholderid) => {
  try {
    // const response = await post(apiUrl+GET_PROJECT_STAKEHOLDER);
    // return response;
    let response;
    if (projectstakeholderid != null) {
  
      response = await post(`${GET_PROJECT_STAKEHOLDER}?project_id=${projectstakeholderid}`);
    } else {
      response = await post(`${GET_PROJECT_STAKEHOLDER}`);
    }
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addProjectStakeholder = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_STAKEHOLDER,
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
export const updateProjectStakeholder = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_STAKEHOLDER +`?psh_id=${objectName?.psh_id}`, objectName);

// delete objectNames
export const deleteProjectStakeholder = (objectName) =>
  // post(`${url.DELETE_ORDER}?psh_id=${order?.psh_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_STAKEHOLDER+`?psh_id=${objectName}`);

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
    `${apiUrl}project_stakeholder/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
