import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_REQUEST_TASK = "budget_request_task/listgrid";
const ADD_BUDGET_REQUEST_TASK = "budget_request_task/insertgrid";
const UPDATE_BUDGET_REQUEST_TASK = "budget_request_task/updategrid";
const DELETE_BUDGET_REQUEST_TASK = "budget_request_task/deletegrid";
// get budget_request_task
export const getBudgetRequestTask = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_BUDGET_REQUEST_TASK}?${queryString}` : GET_BUDGET_REQUEST_TASK;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_request_task
export const addBudgetRequestTask = async (objectName) =>
  post(`${apiUrl}` + ADD_BUDGET_REQUEST_TASK, objectName);

// update budget_request_task
export const updateBudgetRequestTask = (objectName) =>
post(`${apiUrl}`+UPDATE_BUDGET_REQUEST_TASK +`?brt_id=${objectName?.brt_id}`, objectName);

// delete  budget_request_task
export const deleteBudgetRequestTask = (objectName) =>
  post(`${apiUrl}`+DELETE_BUDGET_REQUEST_TASK+`?brt_id=${objectName}`);
