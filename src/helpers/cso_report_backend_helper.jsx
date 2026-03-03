import { post } from "./api_Lists";

const GET_CSO_REPORT = "cso_report/listgrid";
const ADD_CSO_REPORT = "cso_report/insertgrid";
const UPDATE_CSO_REPORT = "cso_report/updategrid";
const DELETE_CSO_REPORT = "cso_report/deletegrid";
const POPULATE_CSO_REPORT = "cso_report/listdropdown";

export const getCsoReport = async (params) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_CSO_REPORT}?${queryString}`
		: GET_CSO_REPORT;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

export const populateCsoReport = async () => {
	try {
		const response = await post(POPULATE_CSO_REPORT);
		return response;
	} catch (error) {
		throw error;
	}
};

export const addCsoReport = async (data) => post(ADD_CSO_REPORT, data);

export const updateCsoReport = (data) =>
	post(UPDATE_CSO_REPORT + `?rpt_id=${data?.rpt_id}`, data);

export const deleteCsoReport = (data) =>
	post(DELETE_CSO_REPORT + `?rpt_id=${data}`);
