import { call, put, takeEvery, select } from "redux-saga/effects";

// project Redux States
import {
  GET_PROJECT,
  ADD_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  FETCH_SINGLE_PROJECT_REQUEST,
} from "./actionTypes";
import {
  getProjectFail,
  getProjectSuccess,
  addProjectFail,
  addProjectSuccess,
  updateProjectSuccess,
  updateProjectFail,
  deleteProjectSuccess,
  deleteProjectFail,
  toggleUpdateLoading,
  fetchSingleProjectFail,
  fetchSingleProjectSuccess,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProject,
  addProject,
  updateProject,
  deleteProject,
  fetchSingleProjectApi,
  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/project_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectR.show_result;

function* fetchProject() {
  try {
    const response = yield call(getProject);
    yield put(getProjectSuccess(response));
    // toast.success(`projects Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectFail(error));
  }
}

function* onUpdateProject({ payload: project, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProject, project);
    yield put(updateProjectSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(project));
    }
    toast.success(`project ${project.prj_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectFail(error));
    toast.error(`project ${project.prj_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProject({ payload: project }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProject, project);
    yield put(deleteProjectSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(project));
    }
    toast.success(`project ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectFail(error));
    toast.error(`project ${project.prj_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProject({ payload: project, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProject, project);

    yield put(addProjectSuccess(response.data));
    toast.success(`project ${response.data.prj_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectFail(error));
    toast.error("project Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* fetchSingleProjectSaga(action) {
  try {
    const response = yield call(fetchSingleProjectApi, action.payload);
    yield put(fetchSingleProjectSuccess(response.data)); // Dispatch success action
  } catch (error) {
    yield put(fetchSingleProjectFail(error.response.data)); // Dispatch failure action
  }
}

function* ProjectSaga() {
  yield takeEvery(GET_PROJECT, fetchProject);
  yield takeEvery(ADD_PROJECT, onAddProject);
  yield takeEvery(UPDATE_PROJECT, onUpdateProject);
  yield takeEvery(DELETE_PROJECT, onDeleteProject);
  yield takeEvery(FETCH_SINGLE_PROJECT_REQUEST, fetchSingleProjectSaga);
}

export default ProjectSaga;
