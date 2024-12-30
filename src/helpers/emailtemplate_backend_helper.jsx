import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_EMAIL_TEMPLATE = "email_template/listgrid";
const ADD_EMAIL_TEMPLATE = "email_template/insertgrid";
const UPDATE_EMAIL_TEMPLATE = "email_template/updategrid";
const DELETE_EMAIL_TEMPLATE = "email_template/deletegrid";
// get email_template
export const getEmailTemplate = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_EMAIL_TEMPLATE}?${queryString}` : GET_EMAIL_TEMPLATE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add email_template
export const addEmailTemplate = async (objectName) =>
  post(`${apiUrl}` + ADD_EMAIL_TEMPLATE, objectName);

// update email_template
export const updateEmailTemplate = (objectName) =>
post(`${apiUrl}`+UPDATE_EMAIL_TEMPLATE +`?emt_id=${objectName?.emt_id}`, objectName);

// delete  email_template
export const deleteEmailTemplate = (objectName) =>
  post(`${apiUrl}`+DELETE_EMAIL_TEMPLATE+`?emt_id=${objectName}`);
