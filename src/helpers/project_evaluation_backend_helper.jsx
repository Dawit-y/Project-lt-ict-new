import { post } from "./api_Lists";

const GET_PROJECT_EVALUATION = "project_evaluation/listgrid";
const ADD_PROJECT_EVALUATION = "project_evaluation/insertgrid";
const UPDATE_PROJECT_EVALUATION = "project_evaluation/updategrid";
const DELETE_PROJECT_EVALUATION = "project_evaluation/deletegrid";

// get project_evaluation
export const getProjectEvaluation = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_PROJECT_EVALUATION}?${queryString}`
		: GET_PROJECT_EVALUATION;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// add project_evaluation
export const addProjectEvaluation = async (data) =>
	post(ADD_PROJECT_EVALUATION, data);

// update project_evaluation
export const updateProjectEvaluation = (data) =>
	post(UPDATE_PROJECT_EVALUATION + `?mne_id=${data?.mne_id}`, data);

// delete  project_evaluation
export const deleteProjectEvaluation = (id) =>
	post(DELETE_PROJECT_EVALUATION + `?mne_id=${id}`);
