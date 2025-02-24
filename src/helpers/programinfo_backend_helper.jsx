import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROGRAM_INFO = "program_info/listgrid";
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
    console.log("Error in fetching data:", error);
  }
};

// add program_info
export const addProgramInfo = async (objectName) =>
  post(`${apiUrl}` + ADD_PROGRAM_INFO, objectName);

// update program_info
export const updateProgramInfo = (objectName) =>
post(`${apiUrl}`+UPDATE_PROGRAM_INFO +`?pri_id=${objectName?.pri_id}`, objectName);

// delete  program_info
export const deleteProgramInfo = (objectName) =>
  post(`${apiUrl}`+DELETE_PROGRAM_INFO+`?pri_id=${objectName}`);
