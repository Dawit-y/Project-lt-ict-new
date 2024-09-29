import {
  GET_PROJECT_CATEGORY,
  GET_PROJECT_CATEGORY_FAIL,
  GET_PROJECT_CATEGORY_SUCCESS,
  ADD_PROJECT_CATEGORY,
  ADD_PROJECT_CATEGORY_SUCCESS,
  ADD_PROJECT_CATEGORY_FAIL,
  UPDATE_PROJECT_CATEGORY,
  UPDATE_PROJECT_CATEGORY_SUCCESS,
  UPDATE_PROJECT_CATEGORY_FAIL,
  DELETE_PROJECT_CATEGORY,
  DELETE_PROJECT_CATEGORY_SUCCESS,
  DELETE_PROJECT_CATEGORY_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getProjectCategory = () => ({
  type: GET_PROJECT_CATEGORY,
});
export const addProjectCategory = (ProjectCategory) => ({
  type: ADD_PROJECT_CATEGORY,
  payload: ProjectCategory,
});
export const updateProjectCategory = (ProjectCategory) => ({
  type: UPDATE_PROJECT_CATEGORY,
  payload: ProjectCategory,
});
export const deleteProjectCategory = (ProjectCategory) => ({
  type: DELETE_PROJECT_CATEGORY,
  payload: ProjectCategory,
});

export const getProjectCategorySuccess = (ProjectCategorys) => ({
  type: GET_PROJECT_CATEGORY_SUCCESS,
  payload: ProjectCategorys,
});

export const getProjectCategoryFail = (error) => ({
  type: GET_PROJECT_CATEGORY_FAIL,
  payload: error,
});

export const addProjectCategorySuccess = (ProjectCategory) => ({
  type: ADD_PROJECT_CATEGORY_SUCCESS,
  payload: ProjectCategory,
});

export const addProjectCategoryFail = (error) => ({
  type: ADD_PROJECT_CATEGORY_FAIL,
  payload: error,
});

export const updateProjectCategorySuccess = (ProjectCategory) => ({
  type: UPDATE_PROJECT_CATEGORY_SUCCESS,
  payload: ProjectCategory,
});

export const updateProjectCategoryFail = (error) => ({
  type: UPDATE_PROJECT_CATEGORY_FAIL,
  payload: error,
});

export const deleteProjectCategorySuccess = (ProjectCategory) => ({
  type: DELETE_PROJECT_CATEGORY_SUCCESS,
  payload: ProjectCategory,
});

export const deleteProjectCategoryFail = (error) => ({
  type: DELETE_PROJECT_CATEGORY_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
