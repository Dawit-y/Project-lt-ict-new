import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_EX_SOURCE = "budget_ex_source/listgrid";
const ADD_BUDGET_EX_SOURCE = "budget_ex_source/insertgrid";
const UPDATE_BUDGET_EX_SOURCE = "budget_ex_source/updategrid";
const DELETE_BUDGET_EX_SOURCE = "budget_ex_source/deletegrid";
// get budget_ex_source
export const getBudgetExSource = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_BUDGET_EX_SOURCE}?${queryString}` : GET_BUDGET_EX_SOURCE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_ex_source
export const addBudgetExSource = async (objectName) =>
  post(`${apiUrl}` + ADD_BUDGET_EX_SOURCE, objectName);

// update budget_ex_source
export const updateBudgetExSource = (objectName) =>
post(`${apiUrl}`+UPDATE_BUDGET_EX_SOURCE +`?bes_id=${objectName?.bes_id}`, objectName);

// delete  budget_ex_source
export const deleteBudgetExSource = (objectName) =>
  post(`${apiUrl}`+DELETE_BUDGET_EX_SOURCE+`?bes_id=${objectName}`);
