import { post } from "./api_Lists";

const GET_USERS = "users/listgrid";
const GET_USER = "users/getuserinfo";
const GET_OWN_USER = "users/getownuserinfo";
const ADD_USERS = "users/insertgrid";
const UPDATE_USERS = "users/updategrid";
const DELETE_USERS = "users/deletegrid";
const UPDATE_USER_STATUS = "users/changeuserstatus";
const CHANGE_PASSWORD = "user/change_password";
const CHANGE_OWN_PASSWORD = "user/change_own_password";
const UPDATE_PROFILE = "users/updateprofile";
const UPDATE_OWN_PROFILE = "users/updateownprofile ";

// get users
export const getUsers = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString ? `${GET_USERS}?${queryString}` : GET_USERS;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// get users
export const getUser = async (params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString ? `${GET_USER}?${queryString}` : GET_USER;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// get own user info
export const getOwnUser = async () => {
	const url = GET_OWN_USER;
	try {
		const response = await post(url);
		return response;
	} catch (error) {
		throw error;
	}
};

// add users
export const addUsers = async (data) => {
	try {
		const response = await post(ADD_USERS, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response;
	} catch (error) {
		throw error;
	}
};

// update users
export const updateUsers = (data) =>
	post(UPDATE_USERS + `?usr_id=${data?.usr_id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

// update profile
export const updateProfile = (data) =>
	post(UPDATE_PROFILE + `?id=${data?.usr_id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
  });
  
// update profile
export const updateOwnProfile = (data) =>
	post(UPDATE_OWN_PROFILE , data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

// change password
export const changeUserStatus = (data) =>
	post(UPDATE_USER_STATUS + `?usr_id=${data?.usr_id}`, data);

// change password
export const changePassword = (data) =>
	post(CHANGE_PASSWORD + `?usr_id=${data?.user_id}`, data);

// change own password
export const changeOwnPassword = (data) => post(CHANGE_OWN_PASSWORD, data);

// delete  users
export const deleteUsers = (data) => post(DELETE_USERS + `?usr_id=${data}`);
