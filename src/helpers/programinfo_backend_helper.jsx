import { post } from "./api_Lists";

const GET_PROGRAM_INFO = "program_info/listgrid";
const GET_PROGRAM_TREE = "program_info/listprogramtree";
const GET_ALL_PROGRAMS = "program_info/listallprogramtree";
const ADD_PROGRAM_INFO = "program_info/insertgrid";
const UPDATE_PROGRAM_INFO = "program_info/updategrid";
const DELETE_PROGRAM_INFO = "program_info/deletegrid";
// get program_info
export const getProgramInfo = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_PROGRAM_INFO}?${queryString}`
		: GET_PROGRAM_INFO;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

export const getProgramTree = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_PROGRAM_TREE}?${queryString}`
		: GET_PROGRAM_TREE;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// get all program_info
export const getAllPrograms = async () => post(GET_ALL_PROGRAMS);

// add program_info
export const addProgramInfo = async (data) => post(ADD_PROGRAM_INFO, data);

// update program_info
export const updateProgramInfo = (data) =>
	post(UPDATE_PROGRAM_INFO + `?pri_id=${data?.pri_id}`, data);

// delete  program_info
export const deleteProgramInfo = (id) =>
	post(DELETE_PROGRAM_INFO + `?pri_id=${id}`);
