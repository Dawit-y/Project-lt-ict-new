import { post } from "./api_Lists";

const GET_PROJECT_PAYMENT = "project_payment/listgrid";
const ADD_PROJECT_PAYMENT = "project_payment/insertgrid";
const UPDATE_PROJECT_PAYMENT = "project_payment/updategrid";
const DELETE_PROJECT_PAYMENT = "project_payment/deletegrid";

export const getProjectPayment = async (project_id_payment) => {
  try {
    let response;
    if (project_id_payment != null) {
      response = await post(`${GET_PROJECT_PAYMENT}?project_id=${project_id_payment}`);
    } else {
      response = await post(`${GET_PROJECT_PAYMENT}`);
    }
    return response;
  } catch (error) {
    throw error
  }
};

export const addProjectPayment = async (data) =>
  post(ADD_PROJECT_PAYMENT, data);

export const updateProjectPayment = (data) =>
  post(UPDATE_PROJECT_PAYMENT + `?prp_id=${data?.prp_id}`, data);

export const deleteProjectPayment = (data) =>
  post(DELETE_PROJECT_PAYMENT + `?prp_id=${data}`);
