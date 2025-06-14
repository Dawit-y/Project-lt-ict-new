import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_MONTH = "budget_month/listgrid";
const ADD_BUDGET_MONTH = "budget_month/insertgrid";
const UPDATE_BUDGET_MONTH = "budget_month/updategrid";
const DELETE_BUDGET_MONTH = "budget_month/deletegrid";
// get budget_month
export const getBudgetMonth = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_BUDGET_MONTH}?${queryString}` : GET_BUDGET_MONTH;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_month
export const addBudgetMonth = async (objectName) =>
	post(ADD_BUDGET_MONTH, objectName);

// update budget_month
export const updateBudgetMonth = (objectName) =>
	post(UPDATE_BUDGET_MONTH + `?bdm_id=${objectName?.bdm_id}`, objectName);

// delete  budget_month
export const deleteBudgetMonth = (objectName) =>
	post(DELETE_BUDGET_MONTH + `?bdm_id=${objectName}`);
