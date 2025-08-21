import { post } from "./api_Lists";

const GET_PROJECT_SUPPLIMENTARY = "project_supplimentary/listgrid";
const ADD_PROJECT_SUPPLIMENTARY = "project_supplimentary/insertgrid";
const UPDATE_PROJECT_SUPPLIMENTARY = "project_supplimentary/updategrid";
const DELETE_PROJECT_SUPPLIMENTARY = "project_supplimentary/deletegrid";
// get project_supplimentary
export const getProjectSupplimentary = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_SUPPLIMENTARY}?${queryString}`
    : GET_PROJECT_SUPPLIMENTARY;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_supplimentary
export const addProjectSupplimentary = async (objectName) =>
  post(ADD_PROJECT_SUPPLIMENTARY, objectName);

// update project_supplimentary
export const updateProjectSupplimentary = (objectName) =>
  post(
    UPDATE_PROJECT_SUPPLIMENTARY + `?prs_id=${objectName?.prs_id}`,
    objectName,
  );

// delete  project_supplimentary
export const deleteProjectSupplimentary = (objectName) =>
  post(DELETE_PROJECT_SUPPLIMENTARY + `?prs_id=${objectName}`);
