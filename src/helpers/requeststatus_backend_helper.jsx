import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_REQUEST_STATUS = "request_status/listgrid";
const ADD_REQUEST_STATUS = "request_status/insertgrid";
const UPDATE_REQUEST_STATUS = "request_status/updategrid";
const DELETE_REQUEST_STATUS = "request_status/deletegrid";
// get request_status
export const getRequestStatus = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_REQUEST_STATUS}?${queryString}` : GET_REQUEST_STATUS;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add request_status
export const addRequestStatus = async (objectName) =>
  post(`${apiUrl}` + ADD_REQUEST_STATUS, objectName);

// update request_status
export const updateRequestStatus = (objectName) =>
post(`${apiUrl}`+UPDATE_REQUEST_STATUS +`?rqs_id=${objectName?.rqs_id}`, objectName);

// delete  request_status
export const deleteRequestStatus = (objectName) =>
  post(`${apiUrl}`+DELETE_REQUEST_STATUS+`?rqs_id=${objectName}`);
