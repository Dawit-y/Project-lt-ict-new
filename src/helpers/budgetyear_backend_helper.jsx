import { post } from "./api_Lists";

const GET_BUDGET_YEAR = "budget_year/listgrid";
const ADD_BUDGET_YEAR = "budget_year/insertgrid";
const UPDATE_BUDGET_YEAR = "budget_year/updategrid";
const DELETE_BUDGET_YEAR = "budget_year/deletegrid";
const POPULATE_BUDGET_YEAR = "budget_year/listdropdown";

export const getBudgetYear = async () => {
  try {
    const response = await post(GET_BUDGET_YEAR);
    return response;
  } catch (error) {
    throw error
  }
};

export const populateBudgetYear = async () => {
  try {
    const response = await post(POPULATE_BUDGET_YEAR);
    return response;
  } catch (error) {
    throw error
  }
};

export const addBudgetYear = async (data) =>
  post(ADD_BUDGET_YEAR, data);

export const updateBudgetYear = (data) =>
  post(UPDATE_BUDGET_YEAR + `?bdy_id=${data?.bdy_id}`, data);

export const deleteBudgetYear = (data) =>
  post(DELETE_BUDGET_YEAR + `?bdy_id=${data}`);
