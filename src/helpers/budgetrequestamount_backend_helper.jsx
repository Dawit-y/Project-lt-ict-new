import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_REQUEST_AMOUNT = "budget_request_amount/listgrid";
const ADD_BUDGET_REQUEST_AMOUNT = "budget_request_amount/insertgrid";
const UPDATE_BUDGET_REQUEST_AMOUNT = "budget_request_amount/updategrid";
const DELETE_BUDGET_REQUEST_AMOUNT = "budget_request_amount/deletegrid";
// get budget_request_amount
export const getBudgetRequestAmount = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_BUDGET_REQUEST_AMOUNT}?${queryString}` : GET_BUDGET_REQUEST_AMOUNT;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add budget_request_amount
export const addBudgetRequestAmount = async (objectName) =>
	post(ADD_BUDGET_REQUEST_AMOUNT, objectName);

// update budget_request_amount
export const updateBudgetRequestAmount = (objectName) =>
	post(
		UPDATE_BUDGET_REQUEST_AMOUNT + `?bra_id=${objectName?.bra_id}`,
		objectName
	);

// delete  budget_request_amount
export const deleteBudgetRequestAmount = (objectName) =>
	post(DELETE_BUDGET_REQUEST_AMOUNT + `?bra_id=${objectName}`);
