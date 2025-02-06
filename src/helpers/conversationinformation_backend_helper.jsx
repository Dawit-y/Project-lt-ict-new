import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_CONVERSATION_INFORMATION = "conversation_information/listgrid";
const ADD_CONVERSATION_INFORMATION = "conversation_information/insertgrid";
const UPDATE_CONVERSATION_INFORMATION = "conversation_information/updategrid";
const DELETE_CONVERSATION_INFORMATION = "conversation_information/deletegrid";
// get conversation_information
export const getConversationInformation = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_CONVERSATION_INFORMATION}?${queryString}` : GET_CONVERSATION_INFORMATION;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add conversation_information
export const addConversationInformation = async (objectName) =>
  post(`${apiUrl}` + ADD_CONVERSATION_INFORMATION, objectName);

// update conversation_information
export const updateConversationInformation = (objectName) =>
post(`${apiUrl}`+UPDATE_CONVERSATION_INFORMATION +`?cvi_id=${objectName?.cvi_id}`, objectName);

// delete  conversation_information
export const deleteConversationInformation = (objectName) =>
  post(`${apiUrl}`+DELETE_CONVERSATION_INFORMATION+`?cvi_id=${objectName}`);
