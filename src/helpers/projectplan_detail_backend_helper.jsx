import { post } from "./api_Lists";

const GET_PROJECT_PLAN_DETAIL = "project_plan_detail/listgrid";
const ADD_PROJECT_PLAN_DETAIL = "project_plan_detail/insertgrid";
const UPDATE_PROJECT_PLAN_DETAIL = "project_plan_detail/updategrid";
const DELETE_PROJECT_PLAN_DETAIL = "project_plan_detail/deletegrid";

// Get project_plan_detail
export const getProjectPlanDetail = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${GET_PROJECT_PLAN_DETAIL}?${queryString}`
		: GET_PROJECT_PLAN_DETAIL;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// Add project_plan_detail
export const addProjectPlanDetail = async (objectName) =>
	post(ADD_PROJECT_PLAN_DETAIL, objectName);

// Update project_plan_detail
export const updateProjectPlanDetail = (objectName) =>
	post(
		UPDATE_PROJECT_PLAN_DETAIL + `?prp_id=${objectName?.prp_id}`,
		objectName
	);

// Delete project_plan_detail
export const deleteProjectPlanDetail = (id) =>
	post(DELETE_PROJECT_PLAN_DETAIL + `?prp_id=${id}`);
