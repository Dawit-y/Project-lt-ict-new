import {
  GET_SECTOR_INFORMATION,
  GET_SECTOR_INFORMATION_FAIL,
  GET_SECTOR_INFORMATION_SUCCESS,
  ADD_SECTOR_INFORMATION,
  ADD_SECTOR_INFORMATION_SUCCESS,
  ADD_SECTOR_INFORMATION_FAIL,
  UPDATE_SECTOR_INFORMATION,
  UPDATE_SECTOR_INFORMATION_SUCCESS,
  UPDATE_SECTOR_INFORMATION_FAIL,
  DELETE_SECTOR_INFORMATION,
  DELETE_SECTOR_INFORMATION_SUCCESS,
  DELETE_SECTOR_INFORMATION_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getSectorInformation = () => ({
  type: GET_SECTOR_INFORMATION,
});
export const addSectorInformation = (SectorInformation) => ({
  type: ADD_SECTOR_INFORMATION,
  payload: SectorInformation,
});
export const updateSectorInformation = (SectorInformation) => ({
  type: UPDATE_SECTOR_INFORMATION,
  payload: SectorInformation,
});
export const deleteSectorInformation = (SectorInformation) => ({
  type: DELETE_SECTOR_INFORMATION,
  payload: SectorInformation,
});

export const getSectorInformationSuccess = (SectorInformations) => ({
  type: GET_SECTOR_INFORMATION_SUCCESS,
  payload: SectorInformations,
});

export const getSectorInformationFail = (error) => ({
  type: GET_SECTOR_INFORMATION_FAIL,
  payload: error,
});

export const addSectorInformationSuccess = (SectorInformation) => ({
  type: ADD_SECTOR_INFORMATION_SUCCESS,
  payload: SectorInformation,
});

export const addSectorInformationFail = (error) => ({
  type: ADD_SECTOR_INFORMATION_FAIL,
  payload: error,
});

export const updateSectorInformationSuccess = (SectorInformation) => ({
  type: UPDATE_SECTOR_INFORMATION_SUCCESS,
  payload: SectorInformation,
});

export const updateSectorInformationFail = (error) => ({
  type: UPDATE_SECTOR_INFORMATION_FAIL,
  payload: error,
});

export const deleteSectorInformationSuccess = (SectorInformation) => ({
  type: DELETE_SECTOR_INFORMATION_SUCCESS,
  payload: SectorInformation,
});

export const deleteSectorInformationFail = (error) => ({
  type: DELETE_SECTOR_INFORMATION_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
