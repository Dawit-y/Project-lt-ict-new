import { call, put, takeEvery, select } from "redux-saga/effects";

// permission Redux States
import {
  GET_PERMISSION,
  ADD_PERMISSION,
  DELETE_PERMISSION,
  UPDATE_PERMISSION,
} from "./actionTypes";
import {
  getPermissionFail,
  getPermissionSuccess,
  addPermissionFail,
  addPermissionSuccess,
  updatePermissionSuccess,
  updatePermissionFail,
  deletePermissionSuccess,
  deletePermissionFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getPermission,
  addPermission,
  updatePermission,
  deletePermission,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/permission_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.PermissionR.show_result;

function* fetchPermission({payload:permissionroleid}) {
  try {
    const response = yield call(getPermission,permissionroleid);
    yield put(getPermissionSuccess(response));
    // toast.success(`permissions Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getPermissionFail(error));
  }
}

function* onUpdatePermission({ payload: permission, modalCallback }) {
  console.log("saga permission",permission)
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updatePermission, permission);
    console.log("saga response",response);
    yield put(updatePermissionSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(permission));
    }
    toast.success(`permission ${permission.pem_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updatePermissionFail(error));
    console.log("saga permition error ",error);
    toast.error(`permission ${error} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeletePermission({ payload: permission }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deletePermission, permission);
    yield put(deletePermissionSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(permission));
    }
    toast.success(`permission ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deletePermissionFail(error));
    toast.error(`permission ${permission.pem_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddPermission({ payload: permission, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addPermission, permission);

    yield put(addPermissionSuccess(response.data));
    toast.success(`permission ${response.data.pem_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addPermissionFail(error));
    toast.error("permission Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* PermissionSaga() {
  yield takeEvery(GET_PERMISSION, fetchPermission);
  yield takeEvery(ADD_PERMISSION, onAddPermission);
  yield takeEvery(UPDATE_PERMISSION, onUpdatePermission);
  yield takeEvery(DELETE_PERMISSION, onDeletePermission);
}

export default PermissionSaga;
