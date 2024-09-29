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

//Include Both Helper File with needed methods
import {
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/department_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.DepartmentR.show_result;

function* fetchDepartment() {
  try {
    const response = yield call(getDepartment);
    yield put(getDepartmentSuccess(response));
    // toast.success(`departments Loading  Successfully`, { autoClose: 2000 });
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
    toast.success(`department ${department.dep_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateDepartmentFail(error));
    toast.error(`department ${department.dep_id} Is Update Failed`, {
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
    toast.success(`department ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteDepartmentFail(error));
    toast.error(`department ${department.dep_id} Is Delete Failed`, {
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
    toast.success(`department ${response.data.dep_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addDepartmentFail(error));
    toast.error("department Added Failed", { autoClose: 2000 });
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
