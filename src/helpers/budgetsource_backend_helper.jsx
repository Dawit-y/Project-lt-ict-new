import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_SOURCE = "budget_source/listgrid";
const ADD_BUDGET_SOURCE = "budget_source/insertgrid";
const UPDATE_BUDGET_SOURCE = "budget_source/updategrid";
const DELETE_BUDGET_SOURCE = "budget_source/deletegrid";
// get Projects
export const getBudgetSource = async () => {
  try {
    const response = await post(apiUrl+GET_BUDGET_SOURCE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addBudgetSource = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_BUDGET_SOURCE,
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
export const updateBudgetSource = (objectName) =>
  post(`${apiUrl}`+UPDATE_BUDGET_SOURCE +`?pbs_id=${objectName?.pbs_id}`, objectName);

// delete objectNames
export const deleteBudgetSource = (objectName) =>
  // post(`${url.DELETE_ORDER}?pbs_id=${order?.pbs_id}`);
  post(`${apiUrl}`+DELETE_BUDGET_SOURCE+`?pbs_id=${objectName}`);

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
    `${apiUrl}budget_source/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
