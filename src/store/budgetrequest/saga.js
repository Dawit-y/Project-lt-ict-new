import { call, put, takeEvery, select } from "redux-saga/effects";

// budgetRequest Redux States
import {
  GET_BUDGET_REQUEST,
  GET_BUDGET_REQUEST_LIST,
  ADD_BUDGET_REQUEST,
  DELETE_BUDGET_REQUEST,
  UPDATE_BUDGET_REQUEST,
} from "./actionTypes";
import {
  getBudgetRequestFail,
  getBudgetRequestSuccess,
  addBudgetRequestFail,
  addBudgetRequestSuccess,
  updateBudgetRequestSuccess,
  updateBudgetRequestFail,
  deleteBudgetRequestSuccess,
  deleteBudgetRequestFail,
  toggleUpdateLoading,
  getBudgetRequestListSuccess,
  getBudgetRequestListFail,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getBudgetRequest,
  getBudgetRequestList,
  addBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/budgetrequest_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.BudgetRequestR.show_result;

function* fetchBudgetRequest({ payload: projectid }) {
  try {
    const response = yield call(getBudgetRequest, projectid);
    yield put(getBudgetRequestSuccess(response));
  } catch (error) {
    yield put(getBudgetRequestFail(error));
  }
}

function* fetchBudgetRequestList() {
  try {
    const response = yield call(getBudgetRequestList);
    yield put(getBudgetRequestListSuccess(response));
  } catch (error) {
    yield put(getBudgetRequestListFail(error));
  }
}

function* onUpdateBudgetRequest({ payload: budgetRequest, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    console.log(budgetRequest);
    const response = yield call(updateBudgetRequest, budgetRequest);
    yield put(updateBudgetRequestSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(budgetRequest));
    }
    toast.success(
      `budgetRequest ${budgetRequest.bdr_id} Is Updated Successfully`,
      {
        autoClose: 2000,
      }
    );
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateBudgetRequestFail(error));
    toast.error(`budgetRequest ${budgetRequest.bdr_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteBudgetRequest({ payload: budgetRequest }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteBudgetRequest, budgetRequest);
    yield put(deleteBudgetRequestSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(budgetRequest));
    }
    toast.success(
      `budgetRequest ${response.deleted_id} Is Delete Successfully`,
      {
        autoClose: 2000,
      }
    );
  } catch (error) {
    yield put(deleteBudgetRequestFail(error));
    toast.error(`budgetRequest ${budgetRequest.bdr_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddBudgetRequest({ payload: budgetRequest, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addBudgetRequest, budgetRequest);

    yield put(addBudgetRequestSuccess(response.data));
    toast.success(
      `budgetRequest ${response.data.bdr_id} Is Added Successfully`,
      {
        autoClose: 2000,
      }
    );
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addBudgetRequestFail(error));
    toast.error("budgetRequest Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* BudgetRequestSaga() {
  yield takeEvery(GET_BUDGET_REQUEST, fetchBudgetRequest);
  yield takeEvery(GET_BUDGET_REQUEST_LIST, fetchBudgetRequestList);
  yield takeEvery(ADD_BUDGET_REQUEST, onAddBudgetRequest);
  yield takeEvery(UPDATE_BUDGET_REQUEST, onUpdateBudgetRequest);
  yield takeEvery(DELETE_BUDGET_REQUEST, onDeleteBudgetRequest);
}

export default BudgetRequestSaga;
