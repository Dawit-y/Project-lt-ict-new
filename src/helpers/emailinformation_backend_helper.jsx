import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_EMAIL_INFORMATION = "email_information/listgrid";
const ADD_EMAIL_INFORMATION = "email_information/insertgrid";
const UPDATE_EMAIL_INFORMATION = "email_information/updategrid";
const DELETE_EMAIL_INFORMATION = "email_information/deletegrid";
// get email_information
export const getEmailInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_EMAIL_INFORMATION}?${queryString}` : GET_EMAIL_INFORMATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add email_information
export const addEmailInformation = async (objectName) =>
  post(`${apiUrl}` + ADD_EMAIL_INFORMATION, objectName);

// update email_information
export const updateEmailInformation = (objectName) =>
post(`${apiUrl}`+UPDATE_EMAIL_INFORMATION +`?emi_id=${objectName?.emi_id}`, objectName);

// delete  email_information
export const deleteEmailInformation = (objectName) =>
  post(`${apiUrl}`+DELETE_EMAIL_INFORMATION+`?emi_id=${objectName}`);
