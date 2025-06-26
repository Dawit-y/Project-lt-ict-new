import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_CONTRACTOR = "project_contractor/listgrid";
const ADD_PROJECT_CONTRACTOR = "project_contractor/insertgrid";
const UPDATE_PROJECT_CONTRACTOR = "project_contractor/updategrid";
const DELETE_PROJECT_CONTRACTOR = "project_contractor/deletegrid";
// get project_contractor
export const getProjectContractor = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_CONTRACTOR}?${queryString}` : GET_PROJECT_CONTRACTOR;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_contractor
export const addProjectContractor = async (objectName) =>
	post(ADD_PROJECT_CONTRACTOR, objectName);

// update project_contractor
export const updateProjectContractor = (objectName) =>
	post(UPDATE_PROJECT_CONTRACTOR + `?cni_id=${objectName?.cni_id}`, objectName);

// delete  project_contractor
export const deleteProjectContractor = (objectName) =>
	post(DELETE_PROJECT_CONTRACTOR + `?cni_id=${objectName}`);
