
import { del, get, post, put } from "./api_Lists";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_ROLES = "roles/listgrid";
const ADD_ROLES = "roles/insertgrid";
const UPDATE_ROLES = "roles/updategrid";
const DELETE_ROLES = "roles/deletegrid";

// get Projects
export const getRoles = async () => {
  
  try {
    const response = await post(GET_ROLES,{});
   
    return response;
   
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// add Role
export const addRoles = async (objectName) => {

  try {
    const response = await post(
    ADD_ROLES,
    objectName
    );
    return response;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};
// update objectNames
export const updateRoles = (objectName) =>
  post(UPDATE_ROLES +`?rol_id=${objectName?.rol_id}`, objectName);

// delete objectNames
export const deleteRoles = (objectName) =>
  {
    console.log("delete object name ",objectName)
    try{
      const response=  // post(`${url.DELETE_ORDER}?rol_id=${order?.rol_id}`);
      post(DELETE_ROLES+`?rol_id=${objectName}`,{});
      return response;
    }catch(e){
      console.log("problems ",e)
    }
  }

  


export const fetchSearchResults = async (searchTerm, selectedFields) => {
  let queryParams = [];
  if (searchTerm && searchTerm.search_en_value) {
    queryParams.push(
      `search_en_name=${encodeURIComponent(searchTerm.search_en_value)}`
    );
  }
  selectedFields.forEach((field) => {
    const [key] = Object.keys(field);
    const value = field[key];
    if (value !== undefined && value !== "") {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  const queryString = queryParams.join("&");
  const response = await post(
    `roles/listgrid?${queryString}`
  );
  return response.data.data;
};

