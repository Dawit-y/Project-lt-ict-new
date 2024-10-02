import { call, put, takeEvery, select } from "redux-saga/effects";

// department Redux States
import {
  GET_DEPARTMENT,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from "./actionTypes";
import {
  getDepartmentFail,
  getDepartmentSuccess,
  addDepartmentFail,
  addDepartmentSuccess,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

// Include Both Helper File with needed methods
import {
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../helpers/department_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCache, setCache, clearCache } from "../../utils/cacheService";

// Cache key for departments
const DEPARTMENT_CACHE_KEY = "departments_cache";

const selectShowResult = (state) => state.DepartmentR.show_result;

function* fetchDepartment() {
  try {
    // Check if cached data exists
    const cachedData = getCache(DEPARTMENT_CACHE_KEY);

    if (cachedData) {
      yield put(getDepartmentSuccess(cachedData));
      return; // Use cache if valid
    }

    // If no cache, fetch from API
    const response = yield call(getDepartment);
    yield put(getDepartmentSuccess(response));

    // Cache the fetched data
    setCache(DEPARTMENT_CACHE_KEY, response);
  } catch (error) {
    yield put(getDepartmentFail(error));
  }
}

function* onUpdateDepartment({ payload: department, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateDepartment, department);
    yield put(updateDepartmentSuccess(response.data));

    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(department));
    }

    // Invalidate cache since data is updated
    clearCache(DEPARTMENT_CACHE_KEY);

    toast.success(`Department ${department.dep_id} is updated successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateDepartmentFail(error));
    toast.error(`Department ${department.dep_id} update failed`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteDepartment({ payload: department }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteDepartment, department);
    yield put(deleteDepartmentSuccess(response));

    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(department));
    }

    // Invalidate cache since data is deleted
    clearCache(DEPARTMENT_CACHE_KEY);

    toast.success(`Department ${response.deleted_id} is deleted successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteDepartmentFail(error));
    toast.error(`Department ${department.dep_id} deletion failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddDepartment({ payload: department, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addDepartment, department);

    yield put(addDepartmentSuccess(response.data));

    // Invalidate cache since new data is added
    clearCache(DEPARTMENT_CACHE_KEY);

    toast.success(`Department ${response.data.dep_id} is added successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addDepartmentFail(error));
    toast.error("Department addition failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* DepartmentSaga() {
  yield takeEvery(GET_DEPARTMENT, fetchDepartment);
  yield takeEvery(ADD_DEPARTMENT, onAddDepartment);
  yield takeEvery(UPDATE_DEPARTMENT, onUpdateDepartment);
  yield takeEvery(DELETE_DEPARTMENT, onDeleteDepartment);
}

export default DepartmentSaga;
