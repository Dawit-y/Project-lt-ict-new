import { post } from "./api_Lists";

const GET_REQUEST_CATEGORY = "request_category/listgrid";
const ADD_REQUEST_CATEGORY = "request_category/insertgrid";
const UPDATE_REQUEST_CATEGORY = "request_category/updategrid";
const DELETE_REQUEST_CATEGORY = "request_category/deletegrid";
// get request_category
export const getRequestCategory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_REQUEST_CATEGORY}?${queryString}`
    : GET_REQUEST_CATEGORY;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add request_category
export const addRequestCategory = async (data) =>
  post(ADD_REQUEST_CATEGORY, data);

// update request_category
export const updateRequestCategory = (data) => {
  if (!data?.rqc_id) {
    throw new Error("Update ID not provided");
  }
  return post(`${UPDATE_REQUEST_CATEGORY}?rqc_id=${data.rqc_id}`, data);
};

// delete request_category
export const deleteRequestCategory = (id) => {
  if (id == null || id === undefined) { 
    throw new Error("Delete ID not provided");
  }
  return post(`${DELETE_REQUEST_CATEGORY}?rqc_id=${id}`);
};
