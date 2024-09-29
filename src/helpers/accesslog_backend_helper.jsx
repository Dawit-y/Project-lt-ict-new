import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_ACCESS_LOG = "access_log/listgrid";
const ADD_ACCESS_LOG = "access_log/insertgrid";
const UPDATE_ACCESS_LOG = "access_log/updategrid";
const DELETE_ACCESS_LOG = "access_log/deletegrid";
// get Projects
export const getAccessLog = async () => {
  try {
    const response = await post(apiUrl+GET_ACCESS_LOG);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addAccessLog = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_ACCESS_LOG,
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
export const updateAccessLog = (objectName) =>
  post(`${apiUrl}`+UPDATE_ACCESS_LOG +`?acl_id=${objectName?.acl_id}`, objectName);

// delete objectNames
export const deleteAccessLog = (objectName) =>
  // post(`${url.DELETE_ORDER}?acl_id=${order?.acl_id}`);
  post(`${apiUrl}`+DELETE_ACCESS_LOG+`?acl_id=${objectName}`);

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
    `${apiUrl}access_log/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
