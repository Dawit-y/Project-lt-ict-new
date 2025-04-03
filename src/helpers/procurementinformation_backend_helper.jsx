import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROCUREMENT_INFORMATION = "procurement_information/listgrid";
const ADD_PROCUREMENT_INFORMATION = "procurement_information/insertgrid";
const UPDATE_PROCUREMENT_INFORMATION = "procurement_information/updategrid";
const DELETE_PROCUREMENT_INFORMATION = "procurement_information/deletegrid";
// get procurement_information
export const getProcurementInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROCUREMENT_INFORMATION}?${queryString}` : GET_PROCUREMENT_INFORMATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add procurement_information
export const addProcurementInformation = async (objectName) =>
  post(`${apiUrl}` + ADD_PROCUREMENT_INFORMATION, objectName);

// update procurement_information
export const updateProcurementInformation = (objectName) =>
post(`${apiUrl}`+UPDATE_PROCUREMENT_INFORMATION +`?pri_id=${objectName?.pri_id}`, objectName);

// delete  procurement_information
export const deleteProcurementInformation = (objectName) =>
  post(`${apiUrl}`+DELETE_PROCUREMENT_INFORMATION+`?pri_id=${objectName}`);
