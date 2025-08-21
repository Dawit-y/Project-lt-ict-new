import { post } from "./api_Lists";

const GET_DEPARTMENT_STRUCTURE = "department/listdepartment";
const GET_DEPARTMENT = "department/listgrid";
const ADD_DEPARTMENT = "department/insertgrid";
const UPDATE_DEPARTMENT = "department/updategrid";
const DELETE_DEPARTMENT = "department/deletegrid";

// get department structure
export const getDepartmentStructure = async () => {
  try {
    const response = await post(GET_DEPARTMENT_STRUCTURE);
    return response;
  } catch (error) {
    throw error;
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
    throw error;
  }
};

//add department
export const addDepartment = (objectName) => post(ADD_DEPARTMENT, objectName);

// update department
export const updateDepartment = (objectName) =>
  post(UPDATE_DEPARTMENT + `?dep_id=${objectName?.dep_id}`, objectName);

// delete delete department
export const deleteDepartment = (objectName) =>
  post(DELETE_DEPARTMENT + `?dep_id=${objectName}`);
