import { call, put, takeEvery, select } from "redux-saga/effects";

// accessLog Redux States
import {
  GET_ACCESS_LOG,
  ADD_ACCESS_LOG,
  DELETE_ACCESS_LOG,
  UPDATE_ACCESS_LOG,
} from "./actionTypes";
import {
  getAccessLogFail,
  getAccessLogSuccess,
  addAccessLogFail,
  addAccessLogSuccess,
  updateAccessLogSuccess,
  updateAccessLogFail,
  deleteAccessLogSuccess,
  deleteAccessLogFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getAccessLog,
  addAccessLog,
  updateAccessLog,
  deleteAccessLog,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/accesslog_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.AccessLogR.show_result;

function* fetchAccessLog() {
  try {
    const response = yield call(getAccessLog);
    yield put(getAccessLogSuccess(response));
    // toast.success(`accessLogs Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getAccessLogFail(error));
  }
}

function* onUpdateAccessLog({ payload: accessLog, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateAccessLog, accessLog);
    yield put(updateAccessLogSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(accessLog));
    }
    toast.success(`accessLog ${accessLog.acl_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateAccessLogFail(error));
    toast.error(`accessLog ${accessLog.acl_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteAccessLog({ payload: accessLog }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteAccessLog, accessLog);
    yield put(deleteAccessLogSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(accessLog));
    }
    toast.success(`accessLog ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteAccessLogFail(error));
    toast.error(`accessLog ${accessLog.acl_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddAccessLog({ payload: accessLog, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addAccessLog, accessLog);

    yield put(addAccessLogSuccess(response.data));
    toast.success(`accessLog ${response.data.acl_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addAccessLogFail(error));
    toast.error("accessLog Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* AccessLogSaga() {
  yield takeEvery(GET_ACCESS_LOG, fetchAccessLog);
  yield takeEvery(ADD_ACCESS_LOG, onAddAccessLog);
  yield takeEvery(UPDATE_ACCESS_LOG, onUpdateAccessLog);
  yield takeEvery(DELETE_ACCESS_LOG, onDeleteAccessLog);
}

export default AccessLogSaga;
