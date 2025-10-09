import { post } from "./api_Lists";

const GET_PROCUREMENT_STAGE = "procurement_stage/listgrid";
const ADD_PROCUREMENT_STAGE = "procurement_stage/insertgrid";
const UPDATE_PROCUREMENT_STAGE = "procurement_stage/updategrid";
const DELETE_PROCUREMENT_STAGE = "procurement_stage/deletegrid";
// get procurement_stage
export const getProcurementStage = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROCUREMENT_STAGE}?${queryString}`
    : GET_PROCUREMENT_STAGE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add procurement_stage
export const addProcurementStage = async (objectName) =>
  post(ADD_PROCUREMENT_STAGE, objectName);

// update procurement_stage
export const updateProcurementStage = (objectName) =>
  post(UPDATE_PROCUREMENT_STAGE + `?pst_id=${objectName?.pst_id}`, objectName);

// delete  procurement_stage
export const deleteProcurementStage = (objectName) =>
  post(DELETE_PROCUREMENT_STAGE + `?pst_id=${objectName}`);
