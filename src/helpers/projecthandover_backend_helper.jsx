import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_HANDOVER = "project_handover/listgrid";
const ADD_PROJECT_HANDOVER = "project_handover/insertgrid";
const UPDATE_PROJECT_HANDOVER = "project_handover/updategrid";
const DELETE_PROJECT_HANDOVER = "project_handover/deletegrid";
// get project_handover
export const getProjectHandover = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_HANDOVER}?${queryString}` : GET_PROJECT_HANDOVER;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_handover
export const addProjectHandover = async (objectName) =>
	post(ADD_PROJECT_HANDOVER, objectName);

// update project_handover
export const updateProjectHandover = (objectName) =>
	post(UPDATE_PROJECT_HANDOVER + `?prh_id=${objectName?.prh_id}`, objectName);

// delete  project_handover
export const deleteProjectHandover = (objectName) =>
	post(DELETE_PROJECT_HANDOVER + `?prh_id=${objectName}`);
