import { call, put, takeEvery, select } from "redux-saga/effects";

// users Redux States
import {
  GET_USERS,
  ADD_USERS,
  DELETE_USERS,
  UPDATE_USERS,
} from "./actionTypes";
import {
  getUsersFail,
  getUsersSuccess,
  addUsersFail,
  addUsersSuccess,
  updateUsersSuccess,
  updateUsersFail,
  deleteUsersSuccess,
  deleteUsersFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getUsers,
  addUsers,
  updateUsers,
  deleteUsers,
} from "../../helpers/users_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.UsersR.show_result;

function* fetchUsers() {
  try {
    const response = yield call(getUsers);
    yield put(getUsersSuccess(response));
    // toast.success(`userss Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getUsersFail(error));
  }
}

function* onUpdateUsers({ payload: users, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateUsers, users);
    yield put(updateUsersSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(users));
    }
    toast.success(`users ${users.usr_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateUsersFail(error));
    toast.error(`users ${users.usr_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteUsers({ payload: users }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteUsers, users);
    yield put(deleteUsersSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(users));
    }
    toast.success(`users ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteUsersFail(error));
    toast.error(`users ${users.usr_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddUsers({ payload: users, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addUsers, users);

    yield put(addUsersSuccess(response.data));
    toast.success(`users ${response.data.usr_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addUsersFail(error));
    toast.error("users Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* UsersSaga() {
  yield takeEvery(GET_USERS, fetchUsers);
  yield takeEvery(ADD_USERS, onAddUsers);
  yield takeEvery(UPDATE_USERS, onUpdateUsers);
  yield takeEvery(DELETE_USERS, onDeleteUsers);
}

export default UsersSaga;
