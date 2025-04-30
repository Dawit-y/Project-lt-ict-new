import { post } from "./api_Lists";

const GET_STAKEHOLDER_TYPE = "stakeholder_type/listgrid";
const ADD_STAKEHOLDER_TYPE = "stakeholder_type/insertgrid";
const UPDATE_STAKEHOLDER_TYPE = "stakeholder_type/updategrid";
const DELETE_STAKEHOLDER_TYPE = "stakeholder_type/deletegrid";

export const getStakeholderType = async () => {
  try {
    const response = await post(GET_STAKEHOLDER_TYPE);
    return response;
  } catch (error) {
    throw error
  }
};

export const addStakeholderType = async (data) =>
  post(ADD_STAKEHOLDER_TYPE, data);

export const updateStakeholderType = (data) =>
  post(UPDATE_STAKEHOLDER_TYPE + `?sht_id=${data?.sht_id}`, data);

export const deleteStakeholderType = (data) =>
  post(DELETE_STAKEHOLDER_TYPE + `?sht_id=${data}`);
