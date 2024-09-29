import { call, put, takeEvery, select } from "redux-saga/effects";

// projectDocument Redux States
import {
  GET_PROJECT_DOCUMENT,
  ADD_PROJECT_DOCUMENT,
  DELETE_PROJECT_DOCUMENT,
  UPDATE_PROJECT_DOCUMENT,
} from "./actionTypes";
import {
  getProjectDocumentFail,
  getProjectDocumentSuccess,
  addProjectDocumentFail,
  addProjectDocumentSuccess,
  updateProjectDocumentSuccess,
  updateProjectDocumentFail,
  deleteProjectDocumentSuccess,
  deleteProjectDocumentFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectDocument,
  addProjectDocument,
  updateProjectDocument,
  deleteProjectDocument,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectdocument_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectDocumentR.show_result;

function* fetchProjectDocument({payload:projectid}) {
  try {
    const response = yield call(getProjectDocument,projectid);
    yield put(getProjectDocumentSuccess(response));
    // toast.success(`projectDocuments Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectDocumentFail(error));
  }
}

function* onUpdateProjectDocument({ payload: projectDocument, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectDocument, projectDocument);
    yield put(updateProjectDocumentSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectDocument));
    }
    toast.success(`projectDocument ${projectDocument.prd_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectDocumentFail(error));
    toast.error(`projectDocument ${projectDocument.prd_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectDocument({ payload: projectDocument }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectDocument, projectDocument);
    yield put(deleteProjectDocumentSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectDocument));
    }
    toast.success(`projectDocument ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectDocumentFail(error));
    toast.error(`projectDocument ${projectDocument.prd_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectDocument({ payload: projectDocument, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectDocument, projectDocument);

    yield put(addProjectDocumentSuccess(response.data));
    toast.success(`projectDocument ${response.data.prd_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectDocumentFail(error));
    toast.error("projectDocument Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectDocumentSaga() {
  yield takeEvery(GET_PROJECT_DOCUMENT, fetchProjectDocument);
  yield takeEvery(ADD_PROJECT_DOCUMENT, onAddProjectDocument);
  yield takeEvery(UPDATE_PROJECT_DOCUMENT, onUpdateProjectDocument);
  yield takeEvery(DELETE_PROJECT_DOCUMENT, onDeleteProjectDocument);
}

export default ProjectDocumentSaga;
