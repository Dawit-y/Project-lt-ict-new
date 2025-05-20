import { del, get, post, put } from "./api_Lists";

const GET_PROJECT_CATEGORY = "project_category/listgrid";
const ADD_PROJECT_CATEGORY = "project_category/insertgrid";
const UPDATE_PROJECT_CATEGORY = "project_category/updategrid";
const DELETE_PROJECT_CATEGORY = "project_category/deletegrid";

export const getProjectCategory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_CATEGORY}?${queryString}` : GET_PROJECT_CATEGORY;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error
  }
};

export const addProjectCategory = (data) =>
  post(ADD_PROJECT_CATEGORY, data);

export const updateProjectCategory = (data) =>
  post(UPDATE_PROJECT_CATEGORY + `?pct_id=${data?.pct_id}`, data);

export const deleteProjectCategory = (data) =>
  post(DELETE_PROJECT_CATEGORY + `?pct_id=${data}`);
