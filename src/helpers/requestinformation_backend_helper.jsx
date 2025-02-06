import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_REQUEST_INFORMATION = "request_information/listgrid";
const ADD_REQUEST_INFORMATION = "request_information/insertgrid";
const UPDATE_REQUEST_INFORMATION = "request_information/updategrid";
const DELETE_REQUEST_INFORMATION = "request_information/deletegrid";
// get request_information
export const getRequestInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_REQUEST_INFORMATION}?${queryString}` : GET_REQUEST_INFORMATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add request_information
export const addRequestInformation = async (objectName) =>
  post(`${apiUrl}` + ADD_REQUEST_INFORMATION, objectName);

// update request_information
export const updateRequestInformation = (objectName) =>
post(`${apiUrl}`+UPDATE_REQUEST_INFORMATION +`?rqi_id=${objectName?.rqi_id}`, objectName);

// delete  request_information
export const deleteRequestInformation = (objectName) =>
  post(`${apiUrl}`+DELETE_REQUEST_INFORMATION+`?rqi_id=${objectName}`);
