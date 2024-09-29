import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_CONTRACTOR_TYPE = "contractor_type/listgrid";
const ADD_CONTRACTOR_TYPE = "contractor_type/insertgrid";
const UPDATE_CONTRACTOR_TYPE = "contractor_type/updategrid";
const DELETE_CONTRACTOR_TYPE = "contractor_type/deletegrid";
// get Projects
export const getContractorType = async () => {
  try {
    const response = await post(apiUrl+GET_CONTRACTOR_TYPE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addContractorType = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_CONTRACTOR_TYPE,
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
export const updateContractorType = (objectName) =>
  post(`${apiUrl}`+UPDATE_CONTRACTOR_TYPE +`?cnt_id=${objectName?.cnt_id}`, objectName);

// delete objectNames
export const deleteContractorType = (objectName) =>
  // post(`${url.DELETE_ORDER}?cnt_id=${order?.cnt_id}`);
  post(`${apiUrl}`+DELETE_CONTRACTOR_TYPE+`?cnt_id=${objectName}`);

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
    `${apiUrl}contractor_type/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
