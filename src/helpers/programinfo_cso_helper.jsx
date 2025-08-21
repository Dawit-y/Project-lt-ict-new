import { post, get } from "./api_Lists";

const GET_PROGRAM_INFO = "program_info_cso/listgrid";
const GET_SINGLE_PROGRAM_INFO = "program_info_cso/";
const ADD_PROGRAM_INFO = "program_info_cso/insertgrid";
const UPDATE_PROGRAM_INFO = "program_info_cso/updategrid";
const DELETE_PROGRAM_INFO = "program_info_cso/deletegrid";

// get program_info
export const getProgramInfo = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROGRAM_INFO}?${queryString}`
    : GET_PROGRAM_INFO;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSingleProgramInfo = async (id) =>
  get(GET_SINGLE_PROGRAM_INFO + `${id}`);

// add program_info
export const addProgramInfo = async (data) => post(ADD_PROGRAM_INFO, data);

// update program_info
export const updateProgramInfo = (data) =>
  post(UPDATE_PROGRAM_INFO + `?pri_id=${data?.pri_id}`, data);

// delete  program_info
export const deleteProgramInfo = (data) =>
  post(DELETE_PROGRAM_INFO + `?pri_id=${data}`);
