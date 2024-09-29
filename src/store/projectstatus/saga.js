import { call, put, takeEvery, select } from "redux-saga/effects";

// projectStatus Redux States
import {
  GET_PROJECT_STATUS,
  ADD_PROJECT_STATUS,
  DELETE_PROJECT_STATUS,
  UPDATE_PROJECT_STATUS,
} from "./actionTypes";
import {
  getProjectStatusFail,
  getProjectStatusSuccess,
  addProjectStatusFail,
  addProjectStatusSuccess,
  updateProjectStatusSuccess,
  updateProjectStatusFail,
  deleteProjectStatusSuccess,
  deleteProjectStatusFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectStatus,
  addProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectstatus_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectStatusR.show_result;

function* fetchProjectStatus() {
  try {
    const response = yield call(getProjectStatus);
    yield put(getProjectStatusSuccess(response));
    // toast.success(`projectStatuss Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectStatusFail(error));
  }
}

function* onUpdateProjectStatus({ payload: projectStatus, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectStatus, projectStatus);
    yield put(updateProjectStatusSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectStatus));
    }
    toast.success(`projectStatus ${projectStatus.prs_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectStatusFail(error));
    toast.error(`projectStatus ${projectStatus.prs_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectStatus({ payload: projectStatus }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectStatus, projectStatus);
    yield put(deleteProjectStatusSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectStatus));
    }
    toast.success(`projectStatus ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectStatusFail(error));
    toast.error(`projectStatus ${projectStatus.prs_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectStatus({ payload: projectStatus, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectStatus, projectStatus);

    yield put(addProjectStatusSuccess(response.data));
    toast.success(`projectStatus ${response.data.prs_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectStatusFail(error));
    toast.error("projectStatus Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectStatusSaga() {
  yield takeEvery(GET_PROJECT_STATUS, fetchProjectStatus);
  yield takeEvery(ADD_PROJECT_STATUS, onAddProjectStatus);
  yield takeEvery(UPDATE_PROJECT_STATUS, onUpdateProjectStatus);
  yield takeEvery(DELETE_PROJECT_STATUS, onDeleteProjectStatus);
}

export default ProjectStatusSaga;
