import { call, put, takeEvery, select } from "redux-saga/effects";

// projectCategory Redux States
import {
  GET_PROJECT_CATEGORY,
  ADD_PROJECT_CATEGORY,
  DELETE_PROJECT_CATEGORY,
  UPDATE_PROJECT_CATEGORY,
} from "./actionTypes";
import {
  getProjectCategoryFail,
  getProjectCategorySuccess,
  addProjectCategoryFail,
  addProjectCategorySuccess,
  updateProjectCategorySuccess,
  updateProjectCategoryFail,
  deleteProjectCategorySuccess,
  deleteProjectCategoryFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectCategory,
  addProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectcategory_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectCategoryR.show_result;

function* fetchProjectCategory() {
  try {
    const response = yield call(getProjectCategory);
    yield put(getProjectCategorySuccess(response));
    // toast.success(`projectCategorys Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectCategoryFail(error));
  }
}

function* onUpdateProjectCategory({ payload: projectCategory, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectCategory, projectCategory);
    yield put(updateProjectCategorySuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectCategory));
    }
    toast.success(`projectCategory ${projectCategory.pct_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectCategoryFail(error));
    toast.error(`projectCategory ${projectCategory.pct_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectCategory({ payload: projectCategory }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectCategory, projectCategory);
    yield put(deleteProjectCategorySuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectCategory));
    }
    toast.success(`projectCategory ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectCategoryFail(error));
    toast.error(`projectCategory ${projectCategory.pct_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectCategory({ payload: projectCategory, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectCategory, projectCategory);

    yield put(addProjectCategorySuccess(response.data));
    toast.success(`projectCategory ${response.data.pct_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectCategoryFail(error));
    toast.error("projectCategory Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectCategorySaga() {
  yield takeEvery(GET_PROJECT_CATEGORY, fetchProjectCategory);
  yield takeEvery(ADD_PROJECT_CATEGORY, onAddProjectCategory);
  yield takeEvery(UPDATE_PROJECT_CATEGORY, onUpdateProjectCategory);
  yield takeEvery(DELETE_PROJECT_CATEGORY, onDeleteProjectCategory);
}

export default ProjectCategorySaga;
