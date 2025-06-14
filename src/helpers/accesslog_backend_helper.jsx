import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_ACCESS_LOG = "access_log/listgrid";
const ADD_ACCESS_LOG = "access_log/insertgrid";
const UPDATE_ACCESS_LOG = "access_log/updategrid";
const DELETE_ACCESS_LOG = "access_log/deletegrid";
// get access_log
export const getAccessLog = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_ACCESS_LOG}?${queryString}` : GET_ACCESS_LOG;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add access_log
export const addAccessLog = async (objectName) =>
	post(ADD_ACCESS_LOG, objectName);

// update access_log
export const updateAccessLog = (objectName) =>
	post(UPDATE_ACCESS_LOG + `?acl_id=${objectName?.acl_id}`, objectName);

// delete  access_log
export const deleteAccessLog = (objectName) =>
	post(DELETE_ACCESS_LOG + `?acl_id=${objectName}`);
