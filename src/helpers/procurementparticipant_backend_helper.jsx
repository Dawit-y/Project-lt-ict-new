import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROCUREMENT_PARTICIPANT = "procurement_participant/listgrid";
const ADD_PROCUREMENT_PARTICIPANT = "procurement_participant/insertgrid";
const UPDATE_PROCUREMENT_PARTICIPANT = "procurement_participant/updategrid";
const DELETE_PROCUREMENT_PARTICIPANT = "procurement_participant/deletegrid";
// get procurement_participant
export const getProcurementParticipant = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROCUREMENT_PARTICIPANT}?${queryString}` : GET_PROCUREMENT_PARTICIPANT;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add procurement_participant
export const addProcurementParticipant = async (objectName) =>
	post(ADD_PROCUREMENT_PARTICIPANT, objectName);

// update procurement_participant
export const updateProcurementParticipant = (objectName) =>
	post(
		UPDATE_PROCUREMENT_PARTICIPANT + `?ppp_id=${objectName?.ppp_id}`,
		objectName
	);

// delete  procurement_participant
export const deleteProcurementParticipant = (objectName) =>
	post(DELETE_PROCUREMENT_PARTICIPANT + `?ppp_id=${objectName}`);
