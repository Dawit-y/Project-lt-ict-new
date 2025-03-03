import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_CSO_INFO = "cso_info/listgrid";
const ADD_CSO_INFO = "cso_info/insertgrid";
const UPDATE_CSO_INFO = "cso_info/updategrid";
const DELETE_CSO_INFO = "cso_info/deletegrid";
// get cso_info
export const getCsoInfo = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_CSO_INFO}?${queryString}` : GET_CSO_INFO;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add cso_info
export const addCsoInfo = async (objectName) =>
  post(`${apiUrl}` + ADD_CSO_INFO, objectName);

// update cso_info
export const updateCsoInfo = (objectName) =>
post(`${apiUrl}`+UPDATE_CSO_INFO +`?cso_id=${objectName?.cso_id}`, objectName);

// delete  cso_info
export const deleteCsoInfo = (objectName) =>
  post(`${apiUrl}`+DELETE_CSO_INFO+`?cso_id=${objectName}`);
