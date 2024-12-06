import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_PAYMENT = "project_payment/listgrid";
const ADD_PROJECT_PAYMENT = "project_payment/insertgrid";
const UPDATE_PROJECT_PAYMENT = "project_payment/updategrid";
const DELETE_PROJECT_PAYMENT = "project_payment/deletegrid";
// get project_payment
export const getProjectPayment = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_PAYMENT}?${queryString}` : GET_PROJECT_PAYMENT;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_payment
export const addProjectPayment = async (objectName) =>
  post(`${apiUrl}` + ADD_PROJECT_PAYMENT, objectName);

// update project_payment
export const updateProjectPayment = (objectName) =>
post(`${apiUrl}`+UPDATE_PROJECT_PAYMENT +`?prp_id=${objectName?.prp_id}`, objectName);

// delete  project_payment
export const deleteProjectPayment = (objectName) =>
  post(`${apiUrl}`+DELETE_PROJECT_PAYMENT+`?prp_id=${objectName}`);
