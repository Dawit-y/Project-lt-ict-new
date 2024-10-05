import {
  GET_USERS,
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
  ADD_USERS,
  ADD_USERS_SUCCESS,
  ADD_USERS_FAIL,
  UPDATE_USERS,
  UPDATE_USERS_SUCCESS,
  UPDATE_USERS_FAIL,
  DELETE_USERS,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAIL,
  TOGGLE_UPDATE_LOADING
} from "./actionTypes";

export const getUsers = () => ({
  type: GET_USERS,
});
export const addUsers = (Users) => ({
  type: ADD_USERS,
  payload: Users,
});
export const updateUsers = (Users) => ({
  type: UPDATE_USERS,
  payload: Users,
});
export const deleteUsers = (Users) => ({
  type: DELETE_USERS,
  payload: Users,
});

export const getUsersSuccess = (Users) => ({
  type: GET_USERS_SUCCESS,
  payload: Users,
});

export const getUsersFail = (error) => ({
  type: GET_USERS_FAIL,
  payload: error,
});

export const addUsersSuccess = (Users) => ({
  type: ADD_USERS_SUCCESS,
  payload: Users,
});

export const addUsersFail = (error) => ({
  type: ADD_USERS_FAIL,
  payload: error,
});

export const updateUsersSuccess = (Users) => ({
  type: UPDATE_USERS_SUCCESS,
  payload: Users,
});

export const updateUsersFail = (error) => ({
  type: UPDATE_USERS_FAIL,
  payload: error,
});

export const deleteUsersSuccess = (Users) => ({
  type: DELETE_USERS_SUCCESS,
  payload: Users,
});

export const deleteUsersFail = (error) => ({
  type: DELETE_USERS_FAIL,
  payload: error,
});

export const toggleUpdateLoading = (value) => ({
  type: TOGGLE_UPDATE_LOADING,
  payload: value,
});
