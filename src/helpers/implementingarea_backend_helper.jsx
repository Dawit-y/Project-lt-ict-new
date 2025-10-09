import { post } from "./api_Lists";

const GET_IMPLEMENTING_AREA = "implementing_area/listgrid";
const ADD_IMPLEMENTING_AREA = "implementing_area/insertgrid";
const UPDATE_IMPLEMENTING_AREA = "implementing_area/updategrid";
const DELETE_IMPLEMENTING_AREA = "implementing_area/deletegrid";
// get implementing_area
export const getImplementingArea = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_IMPLEMENTING_AREA}?${queryString}`
    : GET_IMPLEMENTING_AREA;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// add implementing_area
export const addImplementingArea = async (objectName) =>
  post(ADD_IMPLEMENTING_AREA, objectName);

// update implementing_area
export const updateImplementingArea = (objectName) =>
  post(UPDATE_IMPLEMENTING_AREA + `?pia_id=${objectName?.pia_id}`, objectName);

// delete  implementing_area
export const deleteImplementingArea = (objectName) =>
  post(DELETE_IMPLEMENTING_AREA + `?pia_id=${objectName}`);
