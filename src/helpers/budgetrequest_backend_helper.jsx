import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_REQUEST = "budget_request/listgrid";
const ADD_BUDGET_REQUEST = "budget_request/insertgrid";
const UPDATE_BUDGET_REQUEST = "budget_request/updategrid";
const DELETE_BUDGET_REQUEST = "budget_request/deletegrid";
// get Projects
export const getBudgetRequest = async (project_ID) => {
  try {
    // const response = await post(apiUrl+GET_BUDGET_REQUEST);
    // return response;
    let response;
    if (project_ID != null) {
      // response = await post(`${apiUrl}${GET_PROJECT_PAYMENT}?project_payment=2`);
      response = await post(
        `${apiUrl}${GET_BUDGET_REQUEST}?project_id=${project_ID}`
      );
    } else {
      response = await post(`${apiUrl}${GET_BUDGET_REQUEST}`);
    }
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addBudgetRequest = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}` + ADD_BUDGET_REQUEST,
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
export const updateBudgetRequest = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_BUDGET_REQUEST + `?bdr_id=${objectName?.bdr_id}`,
    objectName
  );

// delete objectNames
export const deleteBudgetRequest = (objectName) =>
  // post(`${url.DELETE_ORDER}?bdr_id=${order?.bdr_id}`);
  post(`${apiUrl}` + DELETE_BUDGET_REQUEST + `?bdr_id=${objectName}`);

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
    `${apiUrl}budget_request/listgrid?${queryString}`
  );
  return response.data.data;
};
export {};
