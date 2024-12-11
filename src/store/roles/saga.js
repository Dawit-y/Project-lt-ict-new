import { call, put, takeEvery, select } from "redux-saga/effects";

// roles Redux States
import {
  GET_ROLES,
  ADD_ROLES,
  DELETE_ROLES,
  UPDATE_ROLES,
} from "./actionTypes";
import {
  getRolesFail,
  getRolesSuccess,
  addRolesFail,
  addRolesSuccess,
  updateRolesSuccess,
  updateRolesFail,
  deleteRolesSuccess,
  deleteRolesFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getRoles,
  addRoles,
  updateRoles,
  deleteRoles,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/roles_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.RolesR.show_result;

function* fetchRoles() {
  try {
    const response = yield call(getRoles);
    yield put(getRolesSuccess(response));
    // toast.success(`roless Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getRolesFail(error));
  }
}

function* onUpdateRoles({ payload: roles, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateRoles, roles);
    yield put(updateRolesSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(roles));
    }
    toast.success(`Role Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateRolesFail(error));
    toast.error(`role update failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteRoles({ payload: roles }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteRoles, roles);
    yield put(deleteRolesSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(roles));
    }
    toast.success(`roles ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteRolesFail(error));
    toast.error(`roles ${roles.rol_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddRoles({ payload: roles, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addRoles, roles);

    yield put(addRolesSuccess(response.data));
    toast.success(`roles ${response.data.rol_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addRolesFail(error));
    toast.error("roles Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* RolesSaga() {
  yield takeEvery(GET_ROLES, fetchRoles);
  yield takeEvery(ADD_ROLES, onAddRoles);
  yield takeEvery(UPDATE_ROLES, onUpdateRoles);
  yield takeEvery(DELETE_ROLES, onDeleteRoles);
}

export default RolesSaga;
