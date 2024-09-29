import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_ADDRESS_STRUCTURE = "address_structure/listgrid";
const ADD_ADDRESS_STRUCTURE = "address_structure/insertgrid";
const UPDATE_ADDRESS_STRUCTURE = "address_structure/updategrid";
const DELETE_ADDRESS_STRUCTURE = "address_structure/deletegrid";
// get Projects
export const getAddressStructure = async () => {
  try {
    const response = await post(apiUrl+GET_ADDRESS_STRUCTURE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addAddressStructure = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_ADDRESS_STRUCTURE,
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
export const updateAddressStructure = (objectName) =>
  post(`${apiUrl}`+UPDATE_ADDRESS_STRUCTURE +`?add_id=${objectName?.add_id}`, objectName);

// delete objectNames
export const deleteAddressStructure = (objectName) =>
  // post(`${url.DELETE_ORDER}?add_id=${order?.add_id}`);
  post(`${apiUrl}`+DELETE_ADDRESS_STRUCTURE+`?add_id=${objectName}`);

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
    `${apiUrl}address_structure/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
