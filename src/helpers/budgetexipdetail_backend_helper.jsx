import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_EXIP_DETAIL = "budget_exip_detail/listgrid";
const ADD_BUDGET_EXIP_DETAIL = "budget_exip_detail/insertgrid";
const UPDATE_BUDGET_EXIP_DETAIL = "budget_exip_detail/updategrid";
const DELETE_BUDGET_EXIP_DETAIL = "budget_exip_detail/deletegrid";
// get budget_exip_detail
export const getBudgetExipDetail = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_BUDGET_EXIP_DETAIL}?${queryString}` : GET_BUDGET_EXIP_DETAIL;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_exip_detail
export const addBudgetExipDetail = async (objectName) =>
  post(`${apiUrl}` + ADD_BUDGET_EXIP_DETAIL, objectName);

// update budget_exip_detail
export const updateBudgetExipDetail = (objectName) =>
post(`${apiUrl}`+UPDATE_BUDGET_EXIP_DETAIL +`?bed_id=${objectName?.bed_id}`, objectName);

// delete  budget_exip_detail
export const deleteBudgetExipDetail = (objectName) =>
  post(`${apiUrl}`+DELETE_BUDGET_EXIP_DETAIL+`?bed_id=${objectName}`);
