import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_PERFORMANCE = "project_performance/listgrid";
const ADD_PROJECT_PERFORMANCE = "project_performance/insertgrid";
const UPDATE_PROJECT_PERFORMANCE = "project_performance/updategrid";
const DELETE_PROJECT_PERFORMANCE = "project_performance/deletegrid";
// get project_performance
export const getProjectPerformance = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_PERFORMANCE}?${queryString}` : GET_PROJECT_PERFORMANCE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_performance
export const addProjectPerformance = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_PERFORMANCE, objectName);

// update project_performance
export const updateProjectPerformance = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_PERFORMANCE +`?prp_id=${objectName?.prp_id}`, objectName);

// delete  project_performance
export const deleteProjectPerformance = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_PERFORMANCE+`?prp_id=${objectName}`);
