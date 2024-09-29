import {
  GET_SECTOR_CATEGORY,
  GET_SECTOR_CATEGORY_FAIL,
  GET_SECTOR_CATEGORY_SUCCESS,
  ADD_SECTOR_CATEGORY,
  ADD_SECTOR_CATEGORY_SUCCESS,
  ADD_SECTOR_CATEGORY_FAIL,
  UPDATE_SECTOR_CATEGORY,
  UPDATE_SECTOR_CATEGORY_SUCCESS,
  UPDATE_SECTOR_CATEGORY_FAIL,
  DELETE_SECTOR_CATEGORY,
  DELETE_SECTOR_CATEGORY_SUCCESS,
  DELETE_SECTOR_CATEGORY_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getSectorCategory = () => ({
  type: GET_SECTOR_CATEGORY,
});
export const addSectorCategory = (SectorCategory) => ({
  type: ADD_SECTOR_CATEGORY,
  payload: SectorCategory,
});
export const updateSectorCategory = (SectorCategory) => ({
  type: UPDATE_SECTOR_CATEGORY,
  payload: SectorCategory,
});
export const deleteSectorCategory = (SectorCategory) => ({
  type: DELETE_SECTOR_CATEGORY,
  payload: SectorCategory,
});

export const getSectorCategorySuccess = (SectorCategorys) => ({
  type: GET_SECTOR_CATEGORY_SUCCESS,
  payload: SectorCategorys,
});

export const getSectorCategoryFail = (error) => ({
  type: GET_SECTOR_CATEGORY_FAIL,
  payload: error,
});

export const addSectorCategorySuccess = (SectorCategory) => ({
  type: ADD_SECTOR_CATEGORY_SUCCESS,
  payload: SectorCategory,
});

export const addSectorCategoryFail = (error) => ({
  type: ADD_SECTOR_CATEGORY_FAIL,
  payload: error,
});

export const updateSectorCategorySuccess = (SectorCategory) => ({
  type: UPDATE_SECTOR_CATEGORY_SUCCESS,
  payload: SectorCategory,
});

export const updateSectorCategoryFail = (error) => ({
  type: UPDATE_SECTOR_CATEGORY_FAIL,
  payload: error,
});

export const deleteSectorCategorySuccess = (SectorCategory) => ({
  type: DELETE_SECTOR_CATEGORY_SUCCESS,
  payload: SectorCategory,
});

export const deleteSectorCategoryFail = (error) => ({
  type: DELETE_SECTOR_CATEGORY_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
