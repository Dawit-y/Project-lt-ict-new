import { post } from "./api_Lists";

const GET_SMS_TEMPLATE = "sms_template/listgrid";
const ADD_SMS_TEMPLATE = "sms_template/insertgrid";
const UPDATE_SMS_TEMPLATE = "sms_template/updategrid";
const DELETE_SMS_TEMPLATE = "sms_template/deletegrid";
// get sms_template
export const getSmsTemplate = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_SMS_TEMPLATE}?${queryString}`
    : GET_SMS_TEMPLATE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add sms_template
export const addSmsTemplate = async (objectName) =>
  post(ADD_SMS_TEMPLATE, objectName);

// update sms_template
export const updateSmsTemplate = (objectName) =>
  post(UPDATE_SMS_TEMPLATE + `?smt_id=${objectName?.smt_id}`, objectName);

// delete  sms_template
export const deleteSmsTemplate = (objectName) =>
  post(DELETE_SMS_TEMPLATE + `?smt_id=${objectName}`);
