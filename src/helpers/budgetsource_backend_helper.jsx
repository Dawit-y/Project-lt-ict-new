import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_SOURCE = "budget_source/listgrid";
const ADD_BUDGET_SOURCE = "budget_source/insertgrid";
const UPDATE_BUDGET_SOURCE = "budget_source/updategrid";
const DELETE_BUDGET_SOURCE = "budget_source/deletegrid";
// get budget_source
export const getBudgetSource = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  console.log("query string",queryString);
  const url = queryString ? `${GET_BUDGET_SOURCE}?${queryString}` : GET_BUDGET_SOURCE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_source
export const addBudgetSource = async (objectName) =>
  post(`${apiUrl}` + ADD_BUDGET_SOURCE, objectName);

// update budget_source
export const updateBudgetSource = (objectName) =>
post(`${apiUrl}`+UPDATE_BUDGET_SOURCE +`?pbs_id=${objectName?.pbs_id}`, objectName);

// delete  budget_source
export const deleteBudgetSource = (objectName) =>
  post(`${apiUrl}`+DELETE_BUDGET_SOURCE+`?pbs_id=${objectName}`);
