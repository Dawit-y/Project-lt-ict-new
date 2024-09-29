import { call, put, takeEvery, select } from "redux-saga/effects";

// budgetYear Redux States
import {
  GET_BUDGET_YEAR,
  ADD_BUDGET_YEAR,
  DELETE_BUDGET_YEAR,
  UPDATE_BUDGET_YEAR,
} from "./actionTypes";
import {
  getBudgetYearFail,
  getBudgetYearSuccess,
  addBudgetYearFail,
  addBudgetYearSuccess,
  updateBudgetYearSuccess,
  updateBudgetYearFail,
  deleteBudgetYearSuccess,
  deleteBudgetYearFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getBudgetYear,
  addBudgetYear,
  updateBudgetYear,
  deleteBudgetYear,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/budgetyear_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.BudgetYearR.show_result;

function* fetchBudgetYear() {
  try {
    const response = yield call(getBudgetYear);
    yield put(getBudgetYearSuccess(response));
    // toast.success(`budgetYears Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getBudgetYearFail(error));
  }
}

function* onUpdateBudgetYear({ payload: budgetYear, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateBudgetYear, budgetYear);
    yield put(updateBudgetYearSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(budgetYear));
    }
    toast.success(`budgetYear ${budgetYear.bdy_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateBudgetYearFail(error));
    toast.error(`budgetYear ${budgetYear.bdy_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteBudgetYear({ payload: budgetYear }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteBudgetYear, budgetYear);
    yield put(deleteBudgetYearSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(budgetYear));
    }
    toast.success(`budgetYear ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteBudgetYearFail(error));
    toast.error(`budgetYear ${budgetYear.bdy_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddBudgetYear({ payload: budgetYear, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addBudgetYear, budgetYear);

    yield put(addBudgetYearSuccess(response.data));
    toast.success(`budgetYear ${response.data.bdy_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addBudgetYearFail(error));
    toast.error("budgetYear Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* BudgetYearSaga() {
  yield takeEvery(GET_BUDGET_YEAR, fetchBudgetYear);
  yield takeEvery(ADD_BUDGET_YEAR, onAddBudgetYear);
  yield takeEvery(UPDATE_BUDGET_YEAR, onUpdateBudgetYear);
  yield takeEvery(DELETE_BUDGET_YEAR, onDeleteBudgetYear);
}

export default BudgetYearSaga;
