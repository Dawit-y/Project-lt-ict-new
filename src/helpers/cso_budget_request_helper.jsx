import { post } from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_BUDGET_REQUEST = "cso_budget_request/listgrid";
const ADD_BUDGET_REQUEST = "cso_budget_request/insertgrid";
const UPDATE_BUDGET_REQUEST = "cso_budget_request/updategrid";
const DELETE_BUDGET_REQUEST = "cso_budget_request/deletegrid";
const GET_BUDGET_REQUEST_APPROVAL = "cso_proposal_request_approval/listgrid";
const UPDATE_BUDGET_REQUEST_APPROVAL = "cso_proposal_request_approval/updategrid";

export const getBudgetRequest = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_BUDGET_REQUEST}?${queryString}`
    : GET_BUDGET_REQUEST;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error
  }
};

// add project_budget_request
export const addBudgetRequest = async (objectName) =>
	post(ADD_BUDGET_REQUEST, objectName);

// update project_budget_request
export const updateBudgetRequest = (objectName) =>
	post(UPDATE_BUDGET_REQUEST + `?bdr_id=${objectName?.bdr_id}`, objectName);

// delete  project_budget_request
export const deleteBudgetRequest = (objectName) =>
	post(DELETE_BUDGET_REQUEST + `?bdr_id=${objectName}`);

export const getBudgetRequestList = async (params) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_BUDGET_REQUEST}?${queryString}`
		: GET_BUDGET_REQUEST;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

//START APPROVAL
export const getBudgetRequestforApproval = async (params) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_BUDGET_REQUEST_APPROVAL}?${queryString}`
		: GET_BUDGET_REQUEST_APPROVAL;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		console.log(error);
	}
};
// update project_budget_request
export const updateBudgetRequestApproval = (objectName) =>
	post(
		UPDATE_BUDGET_REQUEST_APPROVAL + `?bdr_id=${objectName?.bdr_id}`,
		objectName
	);
