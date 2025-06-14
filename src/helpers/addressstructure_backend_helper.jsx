import { post, get } from "./api_Lists";

const GET_ADDRESS_STRUCTURE = "address_structure/listaddress";
// const GET_ADDRESS_STRUCTURE = "address_structure/listgrid";
const ADD_ADDRESS_STRUCTURE = "address_structure/insertgrid";
const UPDATE_ADDRESS_STRUCTURE = "address_structure/updategrid";
const DELETE_ADDRESS_STRUCTURE = "address_structure/deletegrid";

// get Projects
export const getAddressStructure = async () => {
	try {
		const response = await post(GET_ADDRESS_STRUCTURE);
		return response;
	} catch (error) {
		console.log(error); // Handle any errors
	}
};

export const addAddressStructure = async (params) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${ADD_ADDRESS_STRUCTURE}?${queryString}`
		: ADD_ADDRESS_STRUCTURE;
	return post(url);
};

// update objectNames
export const updateAddressStructure = (params) => {
	const queryString = new URLSearchParams(params).toString();
	const url = queryString
		? `${UPDATE_ADDRESS_STRUCTURE}?${queryString}`
		: UPDATE_ADDRESS_STRUCTURE;
	return post(url);
};

// delete objectNames
export const deleteAddressStructure = (objectName) =>
	post(DELETE_ADDRESS_STRUCTURE + `?id=${objectName}`);
