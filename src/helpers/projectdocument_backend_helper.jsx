import axios from "axios";
import { del, get, post, put } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_DOCUMENT = "project_document/listgrid";
const ADD_PROJECT_DOCUMENT = "project_document/insertgrid";
const UPDATE_PROJECT_DOCUMENT = "project_document/updategrid";
const DELETE_PROJECT_DOCUMENT = "project_document/deletegrid";

// get Projects
export const getProjectDocument = async (params = {}) => {
  const safeParams = params || {};

  // Clean up the params object by removing null or undefined values
  const cleanedParams = Object.fromEntries(
    Object.entries(safeParams).filter(([_, value]) => value != null)
  );

  // Convert the cleaned params to a query string
  const queryString = new URLSearchParams(cleanedParams).toString();
  const url = queryString
    ? `${GET_PROJECT_DOCUMENT}?${queryString}`
    : GET_PROJECT_DOCUMENT;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add Projects
export const addProjectDocument = async (objectName) => {
  try {
    const response = await axios.post(
      `${apiUrl}` + ADD_PROJECT_DOCUMENT,
      objectName,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
export const updateProjectDocument = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_PROJECT_DOCUMENT + `?prd_id=${objectName?.prd_id}`,
    objectName,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

// delete objectNames
export const deleteProjectDocument = (objectName) =>
  post(`${apiUrl}` + DELETE_PROJECT_DOCUMENT + `?prd_id=${objectName}`);
