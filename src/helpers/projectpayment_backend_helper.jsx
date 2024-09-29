import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_PAYMENT = "project_payment/listgrid";
const ADD_PROJECT_PAYMENT = "project_payment/insertgrid";
const UPDATE_PROJECT_PAYMENT = "project_payment/updategrid";
const DELETE_PROJECT_PAYMENT = "project_payment/deletegrid";
// get Projects
export const getProjectPayment = async (project_id_payment) => {
  try {
    
    let response;
    if (project_id_payment != null) {
      // response = await post(`${apiUrl}${GET_PROJECT_PAYMENT}?project_payment=2`);
      response = await post(`${GET_PROJECT_PAYMENT}?project_id=${project_id_payment}`);
    } else {
      response = await post(`${GET_PROJECT_PAYMENT}`);
    }
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addProjectPayment = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_PROJECT_PAYMENT,
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
export const updateProjectPayment = (objectName) =>
  post(`${apiUrl}`+UPDATE_PROJECT_PAYMENT +`?prp_id=${objectName?.prp_id}`, objectName);

// delete objectNames
export const deleteProjectPayment = (objectName) =>
  // post(`${url.DELETE_ORDER}?prp_id=${order?.prp_id}`);
  post(`${apiUrl}`+DELETE_PROJECT_PAYMENT+`?prp_id=${objectName}`);

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
    `${apiUrl}project_payment/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
