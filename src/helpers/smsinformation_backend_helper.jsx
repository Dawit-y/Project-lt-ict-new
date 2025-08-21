import { post } from "./api_Lists";

const GET_SMS_INFORMATION = "sms_information/listgrid";
const ADD_SMS_INFORMATION = "sms_information/insertgrid";
const UPDATE_SMS_INFORMATION = "sms_information/updategrid";
const DELETE_SMS_INFORMATION = "sms_information/deletegrid";
// get sms_information
export const getSmsInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_SMS_INFORMATION}?${queryString}`
    : GET_SMS_INFORMATION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add sms_information
export const addSmsInformation = async (objectName) =>
  post(ADD_SMS_INFORMATION, objectName);

// update sms_information
export const updateSmsInformation = (objectName) =>
  post(UPDATE_SMS_INFORMATION + `?smi_id=${objectName?.smi_id}`, objectName);

// delete  sms_information
export const deleteSmsInformation = (objectName) =>
  post(DELETE_SMS_INFORMATION + `?smi_id=${objectName}`);
