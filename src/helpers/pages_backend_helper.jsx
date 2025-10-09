import { post } from "./api_Lists";

const GET_PAGES = "pages/listgrid";
const ADD_PAGES = "pages/insertgrid";
const UPDATE_PAGES = "pages/updategrid";
const DELETE_PAGES = "pages/deletegrid";
// get pages
export const getPages = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PAGES}?${queryString}` : GET_PAGES;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add pages
export const addPages = async (objectName) => post(ADD_PAGES, objectName);

// update pages
export const updatePages = (objectName) =>
  post(UPDATE_PAGES + `?pag_id=${objectName?.pag_id}`, objectName);

// delete  pages
export const deletePages = (objectName) =>
  post(DELETE_PAGES + `?pag_id=${objectName}`);
