import { post, get } from "./api_Lists";

const GET_BUDGET_REQUEST = "budget_request/listgrid";
const ADD_BUDGET_REQUEST = "budget_request/insertgrid";
const UPDATE_BUDGET_REQUEST = "budget_request/updategrid";
const DELETE_BUDGET_REQUEST = "budget_request/deletegrid";
const GET_BUDGET_REQUEST_APPROVAL = "budget_request_approval/listgrid";
const UPDATE_BUDGET_REQUEST_APPROVAL = "budget_request_approval/updategrid";
const BULK_UPDATE_BUDGET_REQUEST_APPROVAL =
  "budget_request_approval/takeaction";

export const getBudgetRequest = async (params) => {
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

export const fetchBudgetRequest = async (bdr_id) => {
  try {
    const response = await get(`/budget_request_approval/${bdr_id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// add project_budget_request
export const addBudgetRequest = async (data) => post(ADD_BUDGET_REQUEST, data);

// update project_budget_request
export const updateBudgetRequest = (data) =>
  post(UPDATE_BUDGET_REQUEST + `?bdr_id=${data?.bdr_id}`, data);

// delete  project_budget_request
export const deleteBudgetRequest = (data) =>
  post(DELETE_BUDGET_REQUEST + `?bdr_id=${data}`);

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
export const updateBudgetRequestApproval = (data) =>
  post(UPDATE_BUDGET_REQUEST_APPROVAL + `?bdr_id=${data?.bdr_id}`, data);

export const bulkUpdateBudgetRequestApproval = async (data) => {
  const queryString = `request_status=${data.request_status}&request_list=${data.request_list.join(",")}`;
  const url = `${BULK_UPDATE_BUDGET_REQUEST_APPROVAL}?${queryString}`;

  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};
