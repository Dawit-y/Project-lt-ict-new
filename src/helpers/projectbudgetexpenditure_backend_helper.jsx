import { post } from "./api_Lists";

const GET_PROJECT_BUDGET_EXPENDITURE = "project_budget_expenditure/listgrid";
const ADD_PROJECT_BUDGET_EXPENDITURE = "project_budget_expenditure/insertgrid";
const UPDATE_PROJECT_BUDGET_EXPENDITURE =
  "project_budget_expenditure/updategrid";
const DELETE_PROJECT_BUDGET_EXPENDITURE =
  "project_budget_expenditure/deletegrid";
// get project_budget_expenditure
export const getProjectBudgetExpenditure = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROJECT_BUDGET_EXPENDITURE}?${queryString}`
    : GET_PROJECT_BUDGET_EXPENDITURE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_budget_expenditure
export const addProjectBudgetExpenditure = async (objectName) =>
  post(ADD_PROJECT_BUDGET_EXPENDITURE, objectName);

// update project_budget_expenditure
export const updateProjectBudgetExpenditure = (objectName) =>
  post(
    UPDATE_PROJECT_BUDGET_EXPENDITURE + `?pbe_id=${objectName?.pbe_id}`,
    objectName,
  );

// delete  project_budget_expenditure
export const deleteProjectBudgetExpenditure = (objectName) =>
  post(DELETE_PROJECT_BUDGET_EXPENDITURE + `?pbe_id=${objectName}`);
