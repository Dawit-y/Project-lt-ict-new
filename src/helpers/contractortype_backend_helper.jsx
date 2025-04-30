import { post } from "./api_Lists";

const GET_CONTRACTOR_TYPE = "contractor_type/listgrid";
const ADD_CONTRACTOR_TYPE = "contractor_type/insertgrid";
const UPDATE_CONTRACTOR_TYPE = "contractor_type/updategrid";
const DELETE_CONTRACTOR_TYPE = "contractor_type/deletegrid";

export const getContractorType = async () => {
  try {
    const response = await post(GET_CONTRACTOR_TYPE);
    return response;
  } catch (error) {
    throw error
  }
};

export const addContractorType = async (data) =>
  post(ADD_CONTRACTOR_TYPE, data);

export const updateContractorType = (data) =>
  post(UPDATE_CONTRACTOR_TYPE + `?cnt_id=${data?.cnt_id}`, data);

export const deleteContractorType = (data) =>
  post(DELETE_CONTRACTOR_TYPE + `?cnt_id=${data}`);
