import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_STAKEHOLDER = "project_stakeholder/listgrid";
const ADD_PROJECT_STAKEHOLDER = "project_stakeholder/insertgrid";
const UPDATE_PROJECT_STAKEHOLDER = "project_stakeholder/updategrid";
const DELETE_PROJECT_STAKEHOLDER = "project_stakeholder/deletegrid";
// get project_stakeholder
export const getProjectStakeholder = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_STAKEHOLDER}?${queryString}` : GET_PROJECT_STAKEHOLDER;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_stakeholder
export const addProjectStakeholder = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_STAKEHOLDER, objectName);

// update project_stakeholder
export const updateProjectStakeholder = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_STAKEHOLDER +`?psh_id=${objectName?.psh_id}`, objectName);

// delete  project_stakeholder
export const deleteProjectStakeholder = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_STAKEHOLDER+`?psh_id=${objectName}`);
