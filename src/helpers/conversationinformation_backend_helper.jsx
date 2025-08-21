import { post } from "./api_Lists";

const GET_CONVERSATION_INFORMATION = "conversation_information/listgrid";
const ADD_CONVERSATION_INFORMATION = "conversation_information/insertgrid";
const UPDATE_CONVERSATION_INFORMATION = "conversation_information/updategrid";
const DELETE_CONVERSATION_INFORMATION = "conversation_information/deletegrid";
// get conversation_information
export const getConversationInformation = async (params = {}) => {
  const safeParams = params || {};
  // Clean up the params object by removing null or undefined values
  const cleanedParams = Object.fromEntries(
    Object.entries(safeParams).filter(([_, value]) => value != null),
  );
  // Convert the cleaned params to a query string
  const queryString = new URLSearchParams(cleanedParams).toString();
  const url = queryString
    ? `${GET_CONVERSATION_INFORMATION}?${queryString}`
    : GET_CONVERSATION_INFORMATION;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add conversation_information
export const addConversationInformation = async (objectName) =>
  post(ADD_CONVERSATION_INFORMATION, objectName);

// update conversation_information
export const updateConversationInformation = (objectName) =>
  post(
    UPDATE_CONVERSATION_INFORMATION + `?cvi_id=${objectName?.cvi_id}`,
    objectName,
  );

// delete  conversation_information
export const deleteConversationInformation = (objectName) =>
  post(DELETE_CONVERSATION_INFORMATION + `?cvi_id=${objectName}`);
