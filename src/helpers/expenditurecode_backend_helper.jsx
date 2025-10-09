import { post } from "./api_Lists";

const GET_EXPENDITURE_CODE = "expenditure_code/listgrid";
const ADD_EXPENDITURE_CODE = "expenditure_code/insertgrid";
const UPDATE_EXPENDITURE_CODE = "expenditure_code/updategrid";
const DELETE_EXPENDITURE_CODE = "expenditure_code/deletegrid";
// get expenditure_code
export const getExpenditureCode = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_EXPENDITURE_CODE}?${queryString}`
    : GET_EXPENDITURE_CODE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add expenditure_code
export const addExpenditureCode = async (objectName) =>
  post(ADD_EXPENDITURE_CODE, objectName);

// update expenditure_code
export const updateExpenditureCode = (objectName) =>
  post(UPDATE_EXPENDITURE_CODE + `?pec_id=${objectName?.pec_id}`, objectName);

// delete  expenditure_code
export const deleteExpenditureCode = (objectName) =>
  post(DELETE_EXPENDITURE_CODE + `?pec_id=${objectName}`);
