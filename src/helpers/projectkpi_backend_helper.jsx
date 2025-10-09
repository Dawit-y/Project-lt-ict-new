import { post } from "./api_Lists";

const GET_PROJECT_KPI = "project_kpi/listgrid";
const ADD_PROJECT_KPI = "project_kpi/insertgrid";
const UPDATE_PROJECT_KPI = "project_kpi/updategrid";
const DELETE_PROJECT_KPI = "project_kpi/deletegrid";
// get project_kpi
export const getProjectKpi = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_KPI}?${queryString}`
    : GET_PROJECT_KPI;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_kpi
export const addProjectKpi = async (objectName) =>
  post(ADD_PROJECT_KPI, objectName);

// update project_kpi
export const updateProjectKpi = (objectName) =>
  post(UPDATE_PROJECT_KPI + `?kpi_id=${objectName?.kpi_id}`, objectName);

// delete  project_kpi
export const deleteProjectKpi = (objectName) =>
  post(DELETE_PROJECT_KPI + `?kpi_id=${objectName}`);
