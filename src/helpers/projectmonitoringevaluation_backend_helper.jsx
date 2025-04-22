import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_MONITORING_EVALUATION = "project_monitoring_evaluation/listgrid";
const ADD_PROJECT_MONITORING_EVALUATION = "project_monitoring_evaluation/insertgrid";
const UPDATE_PROJECT_MONITORING_EVALUATION = "project_monitoring_evaluation/updategrid";
const DELETE_PROJECT_MONITORING_EVALUATION = "project_monitoring_evaluation/deletegrid";
// get project_monitoring_evaluation
export const getProjectMonitoringEvaluation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_MONITORING_EVALUATION}?${queryString}` : GET_PROJECT_MONITORING_EVALUATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_monitoring_evaluation
export const addProjectMonitoringEvaluation = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_MONITORING_EVALUATION, objectName);

// update project_monitoring_evaluation
export const updateProjectMonitoringEvaluation = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_MONITORING_EVALUATION +`?mne_id=${objectName?.mne_id}`, objectName);

// delete  project_monitoring_evaluation
export const deleteProjectMonitoringEvaluation = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_MONITORING_EVALUATION+`?mne_id=${objectName}`);
