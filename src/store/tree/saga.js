import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_API_URL}address_structure`;

// Centralized API call handler
const apiCall = async (url, method = "post", data = null, params = {}) => {
  try {
    const response = await axios({
      url: `${BASE_URL}${url}`,
      method,
      data,
      params,
    });
    return response.data; // Handle data extraction here to simplify sagas
  } catch (error) {
    // Normalize the error message to be consistent across API calls
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Specific API calls
export const fetchProjects = () => apiCall("/listgrid");
export const deleteFolder = (id) =>
  apiCall("/deletegrid", "post", null, { id });
export const addFolder = (rootId, name) =>
  apiCall("/insertgrid", "post", null, { rootId, name });
export const renameFolder = (id, rootId, name) =>
  apiCall("/updategrid", "post", null, { id, rootId, name });

import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_PROJECTS_REQUEST,
  DELETE_FOLDER_REQUEST,
  ADD_FOLDER_REQUEST,
  RENAME_FOLDER_REQUEST,
} from "./actionTypes";
import {
  fetchProjectsSuccess,
  fetchProjectsFailure,
  deleteFolderSuccess,
  deleteFolderFailure,
  addFolderSuccess,
  addFolderFailure,
  renameFolderSuccess,
  renameFolderFailure,
} from "./actions";
import { toast } from "react-toastify";

function* fetchProjectsSaga() {
  try {
    const response = yield call(fetchProjects);
    yield put(fetchProjectsSuccess(response.data));
  } catch (error) {
    yield put(fetchProjectsFailure(error.message));
  }
}

// Worker saga: Delete folder
function* deleteFolderSaga(action) {
  try {
    yield call(deleteFolder, action.payload);
    yield put(deleteFolderSuccess(action.payload));
    console.log("Deleted successfully");
  } catch (error) {
    yield put(deleteFolderFailure(error.message));
  }
}

// Worker saga: Add folder
function* addFolderSaga(action) {
  console.log("add saga", action.payload);
  try {
    const response = yield call(
      addFolder,
      action.payload.rootId,
      action.payload.name
    );
    console.log("after saga", response.data);
    yield put(addFolderSuccess(response.data));
  } catch (error) {
    yield put(addFolderFailure(error.message));
  }
}

// Worker saga: Rename folder
function* renameFolderSaga(action) {
  try {
    yield call(
      renameFolder,
      action.payload.id,
      action.payload.rootId,
      action.payload.name
    );
    yield put(renameFolderSuccess(action.payload));
  } catch (error) {
    yield put(renameFolderFailure(error.message));
  }
}

function* treeSaga() {
  yield takeEvery(FETCH_PROJECTS_REQUEST, fetchProjectsSaga);
  yield takeEvery(DELETE_FOLDER_REQUEST, deleteFolderSaga);
  yield takeEvery(ADD_FOLDER_REQUEST, addFolderSaga);
  yield takeEvery(RENAME_FOLDER_REQUEST, renameFolderSaga);
}

export default treeSaga;
