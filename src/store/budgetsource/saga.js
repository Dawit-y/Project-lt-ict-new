import { call, put, takeEvery, select } from "redux-saga/effects";

// budgetSource Redux States
import {
  GET_BUDGET_SOURCE,
  ADD_BUDGET_SOURCE,
  DELETE_BUDGET_SOURCE,
  UPDATE_BUDGET_SOURCE,
} from "./actionTypes";
import {
  getBudgetSourceFail,
  getBudgetSourceSuccess,
  addBudgetSourceFail,
  addBudgetSourceSuccess,
  updateBudgetSourceSuccess,
  updateBudgetSourceFail,
  deleteBudgetSourceSuccess,
  deleteBudgetSourceFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getBudgetSource,
  addBudgetSource,
  updateBudgetSource,
  deleteBudgetSource,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/budgetsource_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.BudgetSourceR.show_result;

function* fetchBudgetSource() {
  try {
    const response = yield call(getBudgetSource);
    yield put(getBudgetSourceSuccess(response));
    // toast.success(`budgetSources Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getBudgetSourceFail(error));
  }
}

function* onUpdateBudgetSource({ payload: budgetSource, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateBudgetSource, budgetSource);
    yield put(updateBudgetSourceSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(budgetSource));
    }
    toast.success(`budgetSource ${budgetSource.pbs_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateBudgetSourceFail(error));
    toast.error(`budgetSource ${budgetSource.pbs_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteBudgetSource({ payload: budgetSource }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteBudgetSource, budgetSource);
    yield put(deleteBudgetSourceSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(budgetSource));
    }
    toast.success(`budgetSource ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteBudgetSourceFail(error));
    toast.error(`budgetSource ${budgetSource.pbs_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddBudgetSource({ payload: budgetSource, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addBudgetSource, budgetSource);

    yield put(addBudgetSourceSuccess(response.data));
    toast.success(`budgetSource ${response.data.pbs_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addBudgetSourceFail(error));
    toast.error("budgetSource Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* BudgetSourceSaga() {
  yield takeEvery(GET_BUDGET_SOURCE, fetchBudgetSource);
  yield takeEvery(ADD_BUDGET_SOURCE, onAddBudgetSource);
  yield takeEvery(UPDATE_BUDGET_SOURCE, onUpdateBudgetSource);
  yield takeEvery(DELETE_BUDGET_SOURCE, onDeleteBudgetSource);
}

export default BudgetSourceSaga;
