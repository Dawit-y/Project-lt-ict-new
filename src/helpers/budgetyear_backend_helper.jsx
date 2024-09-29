import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_YEAR = "budget_year/listgrid";
const ADD_BUDGET_YEAR = "budget_year/insertgrid";
const UPDATE_BUDGET_YEAR = "budget_year/updategrid";
const DELETE_BUDGET_YEAR = "budget_year/deletegrid";
// get Projects
export const getBudgetYear = async () => {
  try {
    const response = await post(apiUrl+GET_BUDGET_YEAR);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addBudgetYear = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_BUDGET_YEAR,
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
export const updateBudgetYear = (objectName) =>
  post(`${apiUrl}`+UPDATE_BUDGET_YEAR +`?bdy_id=${objectName?.bdy_id}`, objectName);

// delete objectNames
export const deleteBudgetYear = (objectName) =>
  // post(`${url.DELETE_ORDER}?bdy_id=${order?.bdy_id}`);
  post(`${apiUrl}`+DELETE_BUDGET_YEAR+`?bdy_id=${objectName}`);

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
    `${apiUrl}budget_year/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
