import { post} from "./api_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_DATE_SETTING = "date_setting/listgrid";
const ADD_DATE_SETTING = "date_setting/insertgrid";
const UPDATE_DATE_SETTING = "date_setting/updategrid";
const DELETE_DATE_SETTING = "date_setting/deletegrid";
// get date_setting
export const getDateSetting = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_DATE_SETTING}?${queryString}` : GET_DATE_SETTING;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

// add date_setting
export const addDateSetting = async (objectName) =>
	post(ADD_DATE_SETTING, objectName);

// update date_setting
export const updateDateSetting = (objectName) =>
	post(UPDATE_DATE_SETTING + `?dts_id=${objectName?.dts_id}`, objectName);

// delete  date_setting
export const deleteDateSetting = (objectName) =>
	post(DELETE_DATE_SETTING + `?dts_id=${objectName}`);
