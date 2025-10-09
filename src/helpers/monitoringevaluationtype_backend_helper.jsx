import { post } from "./api_Lists";

const GET_MONITORING_EVALUATION_TYPE = "monitoring_evaluation_type/listgrid";
const ADD_MONITORING_EVALUATION_TYPE = "monitoring_evaluation_type/insertgrid";
const UPDATE_MONITORING_EVALUATION_TYPE =
  "monitoring_evaluation_type/updategrid";
const DELETE_MONITORING_EVALUATION_TYPE =
  "monitoring_evaluation_type/deletegrid";
// get monitoring_evaluation_type
export const getMonitoringEvaluationType = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_MONITORING_EVALUATION_TYPE}?${queryString}`
    : GET_MONITORING_EVALUATION_TYPE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add monitoring_evaluation_type
export const addMonitoringEvaluationType = async (objectName) =>
  post(ADD_MONITORING_EVALUATION_TYPE, objectName);

// update monitoring_evaluation_type
export const updateMonitoringEvaluationType = (objectName) =>
  post(
    UPDATE_MONITORING_EVALUATION_TYPE + `?met_id=${objectName?.met_id}`,
    objectName,
  );

// delete  monitoring_evaluation_type
export const deleteMonitoringEvaluationType = (objectName) =>
  post(DELETE_MONITORING_EVALUATION_TYPE + `?met_id=${objectName}`);
