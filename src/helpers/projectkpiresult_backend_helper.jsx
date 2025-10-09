import { post } from "./api_Lists";

const GET_PROJECT_KPI_RESULT = "project_kpi_result/listgrid";
const ADD_PROJECT_KPI_RESULT = "project_kpi_result/insertgrid";
const UPDATE_PROJECT_KPI_RESULT = "project_kpi_result/updategrid";
const DELETE_PROJECT_KPI_RESULT = "project_kpi_result/deletegrid";
// get project_kpi_result
export const getProjectKpiResult = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_KPI_RESULT}?${queryString}`
    : GET_PROJECT_KPI_RESULT;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_kpi_result
export const addProjectKpiResult = async (objectName) =>
  post(ADD_PROJECT_KPI_RESULT, objectName);

// update project_kpi_result
export const updateProjectKpiResult = (objectName) =>
  post(UPDATE_PROJECT_KPI_RESULT + `?kpr_id=${objectName?.kpr_id}`, objectName);

// delete  project_kpi_result
export const deleteProjectKpiResult = (objectName) =>
  post(DELETE_PROJECT_KPI_RESULT + `?kpr_id=${objectName}`);
