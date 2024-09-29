import { call, put, takeEvery, select } from "redux-saga/effects";

// projectStakeholder Redux States
import {
  GET_PROJECT_STAKEHOLDER,
  ADD_PROJECT_STAKEHOLDER,
  DELETE_PROJECT_STAKEHOLDER,
  UPDATE_PROJECT_STAKEHOLDER,
} from "./actionTypes";
import {
  getProjectStakeholderFail,
  getProjectStakeholderSuccess,
  addProjectStakeholderFail,
  addProjectStakeholderSuccess,
  updateProjectStakeholderSuccess,
  updateProjectStakeholderFail,
  deleteProjectStakeholderSuccess,
  deleteProjectStakeholderFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectStakeholder,
  addProjectStakeholder,
  updateProjectStakeholder,
  deleteProjectStakeholder,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectstakeholder_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectStakeholderR.show_result;

function* fetchProjectStakeholder({payload:projectid}) {
  try {
    const response = yield call(getProjectStakeholder,projectid);
    yield put(getProjectStakeholderSuccess(response));
    // toast.success(`projectStakeholders Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectStakeholderFail(error));
  }
}

function* onUpdateProjectStakeholder({ payload: projectStakeholder, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectStakeholder, projectStakeholder);
    yield put(updateProjectStakeholderSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectStakeholder));
    }
    toast.success(`projectStakeholder ${projectStakeholder.psh_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectStakeholderFail(error));
    toast.error(`projectStakeholder ${projectStakeholder.psh_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectStakeholder({ payload: projectStakeholder }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectStakeholder, projectStakeholder);
    yield put(deleteProjectStakeholderSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectStakeholder));
    }
    toast.success(`projectStakeholder ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectStakeholderFail(error));
    toast.error(`projectStakeholder ${projectStakeholder.psh_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectStakeholder({ payload: projectStakeholder, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectStakeholder, projectStakeholder);

    yield put(addProjectStakeholderSuccess(response.data));
    toast.success(`projectStakeholder ${response.data.psh_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectStakeholderFail(error));
    toast.error("projectStakeholder Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectStakeholderSaga() {
  yield takeEvery(GET_PROJECT_STAKEHOLDER, fetchProjectStakeholder);
  yield takeEvery(ADD_PROJECT_STAKEHOLDER, onAddProjectStakeholder);
  yield takeEvery(UPDATE_PROJECT_STAKEHOLDER, onUpdateProjectStakeholder);
  yield takeEvery(DELETE_PROJECT_STAKEHOLDER, onDeleteProjectStakeholder);
}

export default ProjectStakeholderSaga;
