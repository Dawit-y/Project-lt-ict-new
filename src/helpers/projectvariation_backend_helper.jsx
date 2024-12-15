import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_VARIATION = "project_variation/listgrid";
const ADD_PROJECT_VARIATION = "project_variation/insertgrid";
const UPDATE_PROJECT_VARIATION = "project_variation/updategrid";
const DELETE_PROJECT_VARIATION = "project_variation/deletegrid";
// get project_variation
export const getProjectVariation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_VARIATION}?${queryString}` : GET_PROJECT_VARIATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_variation
export const addProjectVariation = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_VARIATION, objectName);

// update project_variation
export const updateProjectVariation = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_VARIATION +`?prv_id=${objectName?.prv_id}`, objectName);

// delete  project_variation
export const deleteProjectVariation = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_VARIATION+`?prv_id=${objectName}`);
