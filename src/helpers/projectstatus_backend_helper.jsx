import { post } from "./api_Lists";

const GET_PROJECT_STATUS = "project_status/listgrid";
const ADD_PROJECT_STATUS = "project_status/insertgrid";
const UPDATE_PROJECT_STATUS = "project_status/updategrid";
const DELETE_PROJECT_STATUS = "project_status/deletegrid";

export const getProjectStatus = async () => {
  try {
    const response = await post(GET_PROJECT_STATUS);
    return response;
  } catch (error) {
    throw error
  }
};

export const addProjectStatus = async (data) =>
  post(ADD_PROJECT_STATUS, data);

export const updateProjectStatus = (data) =>
  post(UPDATE_PROJECT_STATUS + `?prs_id=${data?.prs_id}`, data);

export const deleteProjectStatus = (data) =>
  post(DELETE_PROJECT_STATUS + `?prs_id=${data}`);
