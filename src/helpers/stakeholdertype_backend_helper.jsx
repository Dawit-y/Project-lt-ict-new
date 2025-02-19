import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_STAKEHOLDER_TYPE = "stakeholder_type/listgrid";
const ADD_STAKEHOLDER_TYPE = "stakeholder_type/insertgrid";
const UPDATE_STAKEHOLDER_TYPE = "stakeholder_type/updategrid";
const DELETE_STAKEHOLDER_TYPE = "stakeholder_type/deletegrid";
// get Projects
export const getStakeholderType = async () => {
  try {
    const response = await post(GET_STAKEHOLDER_TYPE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addStakeholderType = async (objectName) =>
post(`${apiUrl}` + ADD_STAKEHOLDER_TYPE, objectName);
// update objectNames
export const updateStakeholderType = (objectName) =>
  post(`${apiUrl}`+UPDATE_STAKEHOLDER_TYPE +`?sht_id=${objectName?.sht_id}`, objectName);

// delete objectNames
export const deleteStakeholderType = (objectName) =>
  // post(`${url.DELETE_ORDER}?sht_id=${order?.sht_id}`);
  post(`${apiUrl}`+DELETE_STAKEHOLDER_TYPE+`?sht_id=${objectName}`);

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
    `${apiUrl}stakeholder_type/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
