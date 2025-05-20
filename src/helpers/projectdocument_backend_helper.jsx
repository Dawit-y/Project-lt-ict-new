import { del, get, post, put } from "./api_Lists";

const GET_PROJECT_DOCUMENT = "project_document/listgrid";
const ADD_PROJECT_DOCUMENT = "project_document/insertgrid";
const UPDATE_PROJECT_DOCUMENT = "project_document/updategrid";
const DELETE_PROJECT_DOCUMENT = "project_document/deletegrid";

export const getProjectDocument = async (params = {}) => {
  const safeParams = params || {};

  const cleanedParams = Object.fromEntries(
    Object.entries(safeParams).filter(([_, value]) => value != null)
  );

  const queryString = new URLSearchParams(cleanedParams).toString();
  const url = queryString
    ? `${GET_PROJECT_DOCUMENT}?${queryString}`
    : GET_PROJECT_DOCUMENT;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error
  }
};

export const addProjectDocument = async (data) =>
  post(
    ADD_PROJECT_DOCUMENT,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateProjectDocument = (data) =>
  post(
    UPDATE_PROJECT_DOCUMENT + `?prd_id=${data?.prd_id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteProjectDocument = (id) =>
  post(DELETE_PROJECT_DOCUMENT + `?prd_id=${id}`);
