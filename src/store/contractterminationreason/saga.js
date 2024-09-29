import { call, put, takeEvery, select } from "redux-saga/effects";

// contractTerminationReason Redux States
import {
  GET_CONTRACT_TERMINATION_REASON,
  ADD_CONTRACT_TERMINATION_REASON,
  DELETE_CONTRACT_TERMINATION_REASON,
  UPDATE_CONTRACT_TERMINATION_REASON,
} from "./actionTypes";
import {
  getContractTerminationReasonFail,
  getContractTerminationReasonSuccess,
  addContractTerminationReasonFail,
  addContractTerminationReasonSuccess,
  updateContractTerminationReasonSuccess,
  updateContractTerminationReasonFail,
  deleteContractTerminationReasonSuccess,
  deleteContractTerminationReasonFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getContractTerminationReason,
  addContractTerminationReason,
  updateContractTerminationReason,
  deleteContractTerminationReason,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/contractterminationreason_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ContractTerminationReasonR.show_result;

function* fetchContractTerminationReason() {
  try {
    const response = yield call(getContractTerminationReason);
    yield put(getContractTerminationReasonSuccess(response));
    // toast.success(`contractTerminationReasons Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getContractTerminationReasonFail(error));
  }
}

function* onUpdateContractTerminationReason({ payload: contractTerminationReason, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateContractTerminationReason, contractTerminationReason);
    yield put(updateContractTerminationReasonSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(contractTerminationReason));
    }
    toast.success(`contractTerminationReason ${contractTerminationReason.ctr_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateContractTerminationReasonFail(error));
    toast.error(`contractTerminationReason ${contractTerminationReason.ctr_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteContractTerminationReason({ payload: contractTerminationReason }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteContractTerminationReason, contractTerminationReason);
    yield put(deleteContractTerminationReasonSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(contractTerminationReason));
    }
    toast.success(`contractTerminationReason ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteContractTerminationReasonFail(error));
    toast.error(`contractTerminationReason ${contractTerminationReason.ctr_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddContractTerminationReason({ payload: contractTerminationReason, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addContractTerminationReason, contractTerminationReason);

    yield put(addContractTerminationReasonSuccess(response.data));
    toast.success(`contractTerminationReason ${response.data.ctr_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addContractTerminationReasonFail(error));
    toast.error("contractTerminationReason Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ContractTerminationReasonSaga() {
  yield takeEvery(GET_CONTRACT_TERMINATION_REASON, fetchContractTerminationReason);
  yield takeEvery(ADD_CONTRACT_TERMINATION_REASON, onAddContractTerminationReason);
  yield takeEvery(UPDATE_CONTRACT_TERMINATION_REASON, onUpdateContractTerminationReason);
  yield takeEvery(DELETE_CONTRACT_TERMINATION_REASON, onDeleteContractTerminationReason);
}

export default ContractTerminationReasonSaga;
