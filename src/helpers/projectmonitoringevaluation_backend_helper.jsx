import { post } from "./api_Lists";

const GET_PROJECT_MONITORING_EVALUATION =
  "project_monitoring_evaluation/listgrid";
const ADD_PROJECT_MONITORING_EVALUATION =
  "project_monitoring_evaluation/insertgrid";
const UPDATE_PROJECT_MONITORING_EVALUATION =
  "project_monitoring_evaluation/updategrid";
const DELETE_PROJECT_MONITORING_EVALUATION =
  "project_monitoring_evaluation/deletegrid";
// get project_monitoring_evaluation
export const getProjectMonitoringEvaluation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_MONITORING_EVALUATION}?${queryString}`
    : GET_PROJECT_MONITORING_EVALUATION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_monitoring_evaluation
export const addProjectMonitoringEvaluation = async (objectName) =>
  post(ADD_PROJECT_MONITORING_EVALUATION, objectName);

// update project_monitoring_evaluation
export const updateProjectMonitoringEvaluation = (objectName) =>
  post(
    UPDATE_PROJECT_MONITORING_EVALUATION + `?mne_id=${objectName?.mne_id}`,
    objectName,
  );

// delete  project_monitoring_evaluation
export const deleteProjectMonitoringEvaluation = (objectName) =>
  post(DELETE_PROJECT_MONITORING_EVALUATION + `?mne_id=${objectName}`);
