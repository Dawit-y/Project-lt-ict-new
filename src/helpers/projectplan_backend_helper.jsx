import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_PLAN = "project_plan/listgrid";
const ADD_PROJECT_PLAN = "project_plan/insertgrid";
const UPDATE_PROJECT_PLAN = "project_plan/updategrid";
const DELETE_PROJECT_PLAN = "project_plan/deletegrid";
// get project_plan
export const getProjectPlan = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_PLAN}?${queryString}` : GET_PROJECT_PLAN;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add addProjectPlan request
export const addProjectPlan = async (objectName) => {
  try {
    const response = await post(
      `${apiUrl}` + ADD_PROJECT_PLAN,
      objectName,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.log("error ",error)
    
    throw error;
  }
};

// add project_plan
export const addProjectPlan_old = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_PLAN, objectName);

// update project_plan
export const updateProjectPlan = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_PLAN +`?pld_id=${objectName?.pld_id}`, objectName);

// delete  project_plan
export const deleteProjectPlan = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_PLAN+`?pld_id=${objectName}`);
