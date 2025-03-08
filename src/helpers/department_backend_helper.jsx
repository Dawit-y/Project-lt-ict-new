import { post } from "./api_Lists";
//import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_DEPARTMENT_STRUCTURE = "department/listdepartment";
const GET_DEPARTMENT = "department/listgrid";
const ADD_DEPARTMENT = "department/insertgrid";
const UPDATE_DEPARTMENT = "department/updategrid";
const DELETE_DEPARTMENT = "department/deletegrid";

// get department structure
export const getDepartmentStructure = async () => {
  try {
    const response = await post(apiUrl + GET_DEPARTMENT_STRUCTURE);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};

// Get departments
export const getDepartment = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_DEPARTMENT}?${queryString}` : GET_DEPARTMENT;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in department:", error);
  }
};

//add department
export const addDepartment = (objectName) =>
  post(`${apiUrl}` + ADD_DEPARTMENT, objectName);

// update department
export const updateDepartment = (objectName) =>
  post(
    `${apiUrl}` + UPDATE_DEPARTMENT + `?dep_id=${objectName?.dep_id}`,
    objectName
  );

// delete delete department
export const deleteDepartment = (objectName) =>
  post(`${apiUrl}` + DELETE_DEPARTMENT + `?dep_id=${objectName}`);
