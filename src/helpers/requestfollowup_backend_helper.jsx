import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_REQUEST_FOLLOWUP = "request_followup/listgrid";
const ADD_REQUEST_FOLLOWUP = "request_followup/insertgrid";
const UPDATE_REQUEST_FOLLOWUP = "request_followup/updategrid";
const DELETE_REQUEST_FOLLOWUP = "request_followup/deletegrid";
// get request_followup
export const getRequestFollowup = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_REQUEST_FOLLOWUP}?${queryString}` : GET_REQUEST_FOLLOWUP;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add request_followup
export const addRequestFollowup = async (objectName) =>
	post(ADD_REQUEST_FOLLOWUP, objectName);

// update request_followup
export const updateRequestFollowup = (objectName) =>
	post(UPDATE_REQUEST_FOLLOWUP + `?rqf_id=${objectName?.rqf_id}`, objectName);

// delete  request_followup
export const deleteRequestFollowup = (objectName) =>
	post(DELETE_REQUEST_FOLLOWUP + `?rqf_id=${objectName}`);
