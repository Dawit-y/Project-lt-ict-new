import { call, put, takeEvery, select } from "redux-saga/effects";

// userRole Redux States
import {
  GET_USER_ROLE,
  ADD_USER_ROLE,
  DELETE_USER_ROLE,
  UPDATE_USER_ROLE,
} from "./actionTypes";
import {
  getUserRoleFail,
  getUserRoleSuccess,
  addUserRoleFail,
  addUserRoleSuccess,
  updateUserRoleSuccess,
  updateUserRoleFail,
  deleteUserRoleSuccess,
  deleteUserRoleFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getUserRole,
  addUserRole,
  updateUserRole,
  deleteUserRole,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/userrole_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.UserRoleR.show_result;

function* fetchUserRole({payload:userRoleId}) {
  try {
    const response = yield call(getUserRole,userRoleId);
    yield put(getUserRoleSuccess(response));
    // toast.success(`userRoles Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getUserRoleFail(error));
  }
}

function* onUpdateUserRole({ payload: userRole, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateUserRole, userRole);
    yield put(updateUserRoleSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(userRole));
    }
    toast.success(`userRole ${userRole.url_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateUserRoleFail(error));
    toast.error(`userRole ${userRole.url_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteUserRole({ payload: userRole }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteUserRole, userRole);
    yield put(deleteUserRoleSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(userRole));
    }
    
    toast.success(`userRole ${userRole} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteUserRoleFail(error));
   
    toast.error(`userRole ${userRole.url_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddUserRole({ payload: userRole, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addUserRole, userRole);

    yield put(addUserRoleSuccess(response.data));
    toast.success(`userRole ${response.data.url_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addUserRoleFail(error));
    toast.error("userRole Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* UserRoleSaga() {
  yield takeEvery(GET_USER_ROLE, fetchUserRole);
  yield takeEvery(ADD_USER_ROLE, onAddUserRole);
  yield takeEvery(UPDATE_USER_ROLE, onUpdateUserRole);
  yield takeEvery(DELETE_USER_ROLE, onDeleteUserRole);
}

export default UserRoleSaga;
