import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_CONTRACT_TERMINATION_REASON = "contract_termination_reason/listgrid";
const ADD_CONTRACT_TERMINATION_REASON = "contract_termination_reason/insertgrid";
const UPDATE_CONTRACT_TERMINATION_REASON = "contract_termination_reason/updategrid";
const DELETE_CONTRACT_TERMINATION_REASON = "contract_termination_reason/deletegrid";
// get contract_termination_reason
export const getContractTerminationReason = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_CONTRACT_TERMINATION_REASON}?${queryString}` : GET_CONTRACT_TERMINATION_REASON;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add contract_termination_reason
export const addContractTerminationReason = async (objectName) =>
	post(ADD_CONTRACT_TERMINATION_REASON, objectName);

// update contract_termination_reason
export const updateContractTerminationReason = (objectName) =>
	post(
		UPDATE_CONTRACT_TERMINATION_REASON + `?ctr_id=${objectName?.ctr_id}`,
		objectName
	);

// delete  contract_termination_reason
export const deleteContractTerminationReason = (objectName) =>
	post(DELETE_CONTRACT_TERMINATION_REASON + `?ctr_id=${objectName}`);
