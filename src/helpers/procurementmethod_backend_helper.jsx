import { post } from "./api_Lists";

const GET_PROCUREMENT_METHOD = "procurement_method/listgrid";
const ADD_PROCUREMENT_METHOD = "procurement_method/insertgrid";
const UPDATE_PROCUREMENT_METHOD = "procurement_method/updategrid";
const DELETE_PROCUREMENT_METHOD = "procurement_method/deletegrid";
// get procurement_method
export const getProcurementMethod = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROCUREMENT_METHOD}?${queryString}`
    : GET_PROCUREMENT_METHOD;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add procurement_method
export const addProcurementMethod = async (objectName) =>
  post(ADD_PROCUREMENT_METHOD, objectName);

// update procurement_method
export const updateProcurementMethod = (objectName) =>
  post(UPDATE_PROCUREMENT_METHOD + `?prm_id=${objectName?.prm_id}`, objectName);

// delete  procurement_method
export const deleteProcurementMethod = (objectName) =>
  post(DELETE_PROCUREMENT_METHOD + `?prm_id=${objectName}`);
