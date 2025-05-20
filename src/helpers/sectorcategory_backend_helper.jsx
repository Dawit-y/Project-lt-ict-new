import { post } from "./api_Lists";

const GET_SECTOR_CATEGORY = "sector_category/listgrid";
const ADD_SECTOR_CATEGORY = "sector_category/insertgrid";
const UPDATE_SECTOR_CATEGORY = "sector_category/updategrid";
const DELETE_SECTOR_CATEGORY = "sector_category/deletegrid";

export const getSectorCategory = async () => {
  try {
    const response = await post(GET_SECTOR_CATEGORY);
    return response;
  } catch (error) {
    throw error
  }
};

export const addSectorCategory = async (data) =>
  post(ADD_SECTOR_CATEGORY, data);

export const updateSectorCategory = (data) =>
  post(UPDATE_SECTOR_CATEGORY + `?psc_delete_time=${data?.psc_delete_time}`, data);

export const deleteSectorCategory = (data) =>
  post(DELETE_SECTOR_CATEGORY + `?psc_delete_time=${data}`);
