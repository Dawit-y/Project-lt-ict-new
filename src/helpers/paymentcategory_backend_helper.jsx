import { post } from "./api_Lists";

const GET_PAYMENT_CATEGORY = "payment_category/listgrid";
const ADD_PAYMENT_CATEGORY = "payment_category/insertgrid";
const UPDATE_PAYMENT_CATEGORY = "payment_category/updategrid";
const DELETE_PAYMENT_CATEGORY = "payment_category/deletegrid";
// get payment_category
export const getPaymentCategory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PAYMENT_CATEGORY}?${queryString}`
    : GET_PAYMENT_CATEGORY;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add payment_category
export const addPaymentCategory = async (objectName) =>
  post(ADD_PAYMENT_CATEGORY, objectName);

// update payment_category
export const updatePaymentCategory = (objectName) =>
  post(UPDATE_PAYMENT_CATEGORY + `?pyc_id=${objectName?.pyc_id}`, objectName);

// delete  payment_category
export const deletePaymentCategory = (objectName) =>
  post(DELETE_PAYMENT_CATEGORY + `?pyc_id=${objectName}`);
