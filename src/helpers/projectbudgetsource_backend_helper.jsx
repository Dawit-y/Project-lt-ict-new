import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_BUDGET_SOURCE = "project_budget_source/listgrid";
const ADD_PROJECT_BUDGET_SOURCE = "project_budget_source/insertgrid";
const UPDATE_PROJECT_BUDGET_SOURCE = "project_budget_source/updategrid";
const DELETE_PROJECT_BUDGET_SOURCE = "project_budget_source/deletegrid";
// get project_budget_source
export const getProjectBudgetSource = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_BUDGET_SOURCE}?${queryString}` : GET_PROJECT_BUDGET_SOURCE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_budget_source
export const addProjectBudgetSource = async (objectName) =>
	post(ADD_PROJECT_BUDGET_SOURCE, objectName);

// update project_budget_source
export const updateProjectBudgetSource = (objectName) =>
	post(
		UPDATE_PROJECT_BUDGET_SOURCE + `?bsr_id=${objectName?.bsr_id}`,
		objectName
	);

// delete  project_budget_source
export const deleteProjectBudgetSource = (objectName) =>
	post(DELETE_PROJECT_BUDGET_SOURCE + `?bsr_id=${objectName}`);
