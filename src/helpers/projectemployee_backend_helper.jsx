import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_PROJECT_EMPLOYEE = "project_employee/listgrid";
const ADD_PROJECT_EMPLOYEE = "project_employee/insertgrid";
const UPDATE_PROJECT_EMPLOYEE = "project_employee/updategrid";
const DELETE_PROJECT_EMPLOYEE = "project_employee/deletegrid";
// get project_employee
export const getProjectEmployee = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_PROJECT_EMPLOYEE}?${queryString}` : GET_PROJECT_EMPLOYEE;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add project_employee
export const addProjectEmployee = async (objectName) =>
	post(ADD_PROJECT_EMPLOYEE, objectName);

// update project_employee
export const updateProjectEmployee = (objectName) =>
	post(UPDATE_PROJECT_EMPLOYEE + `?emp_id=${objectName?.emp_id}`, objectName);

// delete  project_employee
export const deleteProjectEmployee = (objectName) =>
	post(DELETE_PROJECT_EMPLOYEE + `?emp_id=${objectName}`);
