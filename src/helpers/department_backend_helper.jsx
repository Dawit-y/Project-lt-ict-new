import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_DEPARTMENT = "department/listgrid";
const ADD_DEPARTMENT = "department/insertgrid";
const UPDATE_DEPARTMENT = "department/updategrid";
const DELETE_DEPARTMENT = "department/deletegrid";
import accessToken from "./jwt-token-access/accessToken";

// Get Projects
export const getDepartment = async () => {
  try {
    const response = await post(GET_DEPARTMENT
  );
   
    return response;
  } catch (error) {
    console.log("Error:", error); // Handle any errors
  }
};

// add Projects
export const addDepartment = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}`+ADD_DEPARTMENT,
      objectName,
      {
        headers: {
          Authorization: accessToken, // Add accessToken in Authorization header
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
export const updateDepartment = (objectName) =>
  post(`${apiUrl}`+UPDATE_DEPARTMENT +`?dep_id=${objectName?.dep_id}`, objectName, {
    headers: {
      Authorization: accessToken, // Add accessToken in Authorization header
    },
  });

// delete objectNames
export const deleteDepartment = (objectName) =>
  // post(`${url.DELETE_ORDER}?dep_id=${order?.dep_id}`);
  post(`${apiUrl}`+DELETE_DEPARTMENT+`?dep_id=${objectName}`,
    {
      headers: {
        Authorization: accessToken, // Add accessToken in Authorization header
      },
    }
  );

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
    `${apiUrl}department/listgrid?${queryString}`,
    {
      headers: {
        Authorization: accessToken, // Add accessToken in Authorization header
      },
    }
  );
  return response.data.data;
};
export {
  
};
