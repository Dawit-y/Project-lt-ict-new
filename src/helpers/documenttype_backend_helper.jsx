import { post } from "./api_Lists";

const GET_DOCUMENT_TYPE = "document_type/listgrid";
const ADD_DOCUMENT_TYPE = "document_type/insertgrid";
const UPDATE_DOCUMENT_TYPE = "document_type/updategrid";
const DELETE_DOCUMENT_TYPE = "document_type/deletegrid";

export const getDocumentType = async () => {
  try {
    const response = await post(GET_DOCUMENT_TYPE);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addDocumentType = async (data) => post(ADD_DOCUMENT_TYPE, data);

export const updateDocumentType = (data) =>
  post(UPDATE_DOCUMENT_TYPE + `?pdt_id=${data?.pdt_id}`, data);

export const deleteDocumentType = (data) =>
  post(DELETE_DOCUMENT_TYPE + `?pdt_id=${data}`);
