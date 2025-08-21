import { post } from "./api_Lists";

const GET_PROJECT_COMPONENT = "project_component/listgrid";
const ADD_PROJECT_COMPONENT = "project_component/insertgrid";
const UPDATE_PROJECT_COMPONENT = "project_component/updategrid";
const DELETE_PROJECT_COMPONENT = "project_component/deletegrid";
// get project_component
export const getProjectComponent = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_COMPONENT}?${queryString}`
    : GET_PROJECT_COMPONENT;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_component
export const addProjectComponent = async (objectName) =>
  post(ADD_PROJECT_COMPONENT, objectName);

// update project_component
export const updateProjectComponent = (objectName) =>
  post(UPDATE_PROJECT_COMPONENT + `?pcm_id=${objectName?.pcm_id}`, objectName);

// delete  project_component
export const deleteProjectComponent = (objectName) =>
  post(DELETE_PROJECT_COMPONENT + `?pcm_id=${objectName}`);
