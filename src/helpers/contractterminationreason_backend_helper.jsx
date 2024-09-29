import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_CONTRACT_TERMINATION_REASON = "contract_termination_reason/listgrid";
const ADD_CONTRACT_TERMINATION_REASON = "contract_termination_reason/insertgrid";
const UPDATE_CONTRACT_TERMINATION_REASON = "contract_termination_reason/updategrid";
const DELETE_CONTRACT_TERMINATION_REASON = "contract_termination_reason/deletegrid";
// get Projects
export const getContractTerminationReason = async () => {
  try {
    const response = await post(apiUrl+GET_CONTRACT_TERMINATION_REASON);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Projects
export const addContractTerminationReason = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_CONTRACT_TERMINATION_REASON,
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
export const updateContractTerminationReason = (objectName) =>
  post(`${apiUrl}`+UPDATE_CONTRACT_TERMINATION_REASON +`?ctr_id=${objectName?.ctr_id}`, objectName);

// delete objectNames
export const deleteContractTerminationReason = (objectName) =>
  // post(`${url.DELETE_ORDER}?ctr_id=${order?.ctr_id}`);
  post(`${apiUrl}`+DELETE_CONTRACT_TERMINATION_REASON+`?ctr_id=${objectName}`);

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
    `${apiUrl}contract_termination_reason/listgrid?${queryString}`
  );
  return response.data.data;
};
export {
  
};
