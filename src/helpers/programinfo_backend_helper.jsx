import { post } from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROGRAM_INFO = "program_info/listgrid";
const GET_PROGRAM_TREE = "program_info/listprogramtree";
const ADD_PROGRAM_INFO = "program_info/insertgrid";
const UPDATE_PROGRAM_INFO = "program_info/updategrid";
const DELETE_PROGRAM_INFO = "program_info/deletegrid";
// get program_info
export const getProgramInfo = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROGRAM_INFO}?${queryString}` : GET_PROGRAM_INFO;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error
  }
};
export const getProgramTree = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROGRAM_TREE}?${queryString}` : GET_PROGRAM_TREE;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error
  }
};

// add program_info
export const addProgramInfo = async (objectName) =>
	post(ADD_PROGRAM_INFO, objectName);

// update program_info
export const updateProgramInfo = (objectName) =>
	post(UPDATE_PROGRAM_INFO + `?pri_id=${objectName?.pri_id}`, objectName);

// delete  program_info
export const deleteProgramInfo = (objectName) =>
	post(DELETE_PROGRAM_INFO + `?pri_id=${objectName}`);
