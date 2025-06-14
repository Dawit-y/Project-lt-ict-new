import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_REQUEST_CATEGORY = "request_category/listgrid";
const ADD_REQUEST_CATEGORY = "request_category/insertgrid";
const UPDATE_REQUEST_CATEGORY = "request_category/updategrid";
const DELETE_REQUEST_CATEGORY = "request_category/deletegrid";
// get request_category
export const getRequestCategory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_REQUEST_CATEGORY}?${queryString}` : GET_REQUEST_CATEGORY;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add request_category
export const addRequestCategory = async (objectName) =>
	post(ADD_REQUEST_CATEGORY, objectName);

// update request_category
export const updateRequestCategory = (objectName) =>
	post(UPDATE_REQUEST_CATEGORY + `?rqc_id=${objectName?.rqc_id}`, objectName);

// delete  request_category
export const deleteRequestCategory = (objectName) =>
	post(DELETE_REQUEST_CATEGORY + `?rqc_id=${objectName}`);
