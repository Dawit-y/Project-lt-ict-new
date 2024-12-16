import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_BUDGET_PLAN = "project_budget_plan/listgrid";
const ADD_PROJECT_BUDGET_PLAN = "project_budget_plan/insertgrid";
const UPDATE_PROJECT_BUDGET_PLAN = "project_budget_plan/updategrid";
const DELETE_PROJECT_BUDGET_PLAN = "project_budget_plan/deletegrid";
// get project_budget_plan
export const getProjectBudgetPlan = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_BUDGET_PLAN}?${queryString}` : GET_PROJECT_BUDGET_PLAN;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_budget_plan
export const addProjectBudgetPlan = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_BUDGET_PLAN, objectName);

// update project_budget_plan
export const updateProjectBudgetPlan = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_BUDGET_PLAN +`?bpl_id=${objectName?.bpl_id}`, objectName);

// delete  project_budget_plan
export const deleteProjectBudgetPlan = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_BUDGET_PLAN+`?bpl_id=${objectName}`);
