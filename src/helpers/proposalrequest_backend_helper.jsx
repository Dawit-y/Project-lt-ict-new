import { post } from "./api_Lists";

const GET_PROPOSAL_REQUEST = "proposal_request/listgrid";
const ADD_PROPOSAL_REQUEST = "proposal_request/insertgrid";
const UPDATE_PROPOSAL_REQUEST = "proposal_request/updategrid";
const DELETE_PROPOSAL_REQUEST = "proposal_request/deletegrid";
// get proposal_request
export const getProposalRequest = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_PROPOSAL_REQUEST}?${queryString}`
    : GET_PROPOSAL_REQUEST;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add proposal_request
export const addProposalRequest = async (objectName) =>
  post(ADD_PROPOSAL_REQUEST, objectName);

// update proposal_request
export const updateProposalRequest = (objectName) =>
  post(UPDATE_PROPOSAL_REQUEST + `?prr_id=${objectName?.prr_id}`, objectName);

// delete  proposal_request
export const deleteProposalRequest = (objectName) =>
  post(DELETE_PROPOSAL_REQUEST + `?prr_id=${objectName}`);
