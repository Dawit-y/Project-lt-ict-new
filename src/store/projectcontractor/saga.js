import { call, put, takeEvery, select } from "redux-saga/effects";

// projectContractor Redux States
import {
  GET_PROJECT_CONTRACTOR,
  ADD_PROJECT_CONTRACTOR,
  DELETE_PROJECT_CONTRACTOR,
  UPDATE_PROJECT_CONTRACTOR,
} from "./actionTypes";
import {
  getProjectContractorFail,
  getProjectContractorSuccess,
  addProjectContractorFail,
  addProjectContractorSuccess,
  updateProjectContractorSuccess,
  updateProjectContractorFail,
  deleteProjectContractorSuccess,
  deleteProjectContractorFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectContractor,
  addProjectContractor,
  updateProjectContractor,
  deleteProjectContractor,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectcontractor_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectContractorR.show_result;

function* fetchProjectContractor({payload:projectid}) {
  try {
    const response = yield call(getProjectContractor,projectid);
    yield put(getProjectContractorSuccess(response));
    // toast.success(`projectContractors Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectContractorFail(error));
  }
}

function* onUpdateProjectContractor({ payload: projectContractor, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectContractor, projectContractor);
    yield put(updateProjectContractorSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectContractor));
    }
    toast.success(`projectContractor ${projectContractor.cni_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectContractorFail(error));
    toast.error(`projectContractor ${projectContractor.cni_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectContractor({ payload: projectContractor }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectContractor, projectContractor);
    yield put(deleteProjectContractorSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectContractor));
    }
    toast.success(`projectContractor ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectContractorFail(error));
    toast.error(`projectContractor ${projectContractor.cni_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectContractor({ payload: projectContractor, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectContractor, projectContractor);

    yield put(addProjectContractorSuccess(response.data));
    toast.success(`projectContractor ${response.data.cni_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectContractorFail(error));
    toast.error("projectContractor Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectContractorSaga() {
  yield takeEvery(GET_PROJECT_CONTRACTOR, fetchProjectContractor);
  yield takeEvery(ADD_PROJECT_CONTRACTOR, onAddProjectContractor);
  yield takeEvery(UPDATE_PROJECT_CONTRACTOR, onUpdateProjectContractor);
  yield takeEvery(DELETE_PROJECT_CONTRACTOR, onDeleteProjectContractor);
}

export default ProjectContractorSaga;
