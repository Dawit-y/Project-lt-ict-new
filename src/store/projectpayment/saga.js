import { call, put, takeEvery, select } from "redux-saga/effects";

// projectPayment Redux States
import {
  GET_PROJECT_PAYMENT,
  ADD_PROJECT_PAYMENT,
  DELETE_PROJECT_PAYMENT,
  UPDATE_PROJECT_PAYMENT,
} from "./actionTypes";
import {
  getProjectPaymentFail,
  getProjectPaymentSuccess,
  addProjectPaymentFail,
  addProjectPaymentSuccess,
  updateProjectPaymentSuccess,
  updateProjectPaymentFail,
  deleteProjectPaymentSuccess,
  deleteProjectPaymentFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getProjectPayment,
  addProjectPayment,
  updateProjectPayment,
  deleteProjectPayment,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/projectpayment_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ProjectPaymentR.show_result;

function* fetchProjectPayment({payload:projetpaymentid}) {
  try {
    const response = yield call(getProjectPayment,projetpaymentid);
    yield put(getProjectPaymentSuccess(response));
    // toast.success(`projectPayments Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getProjectPaymentFail(error));
  }
}

function* onUpdateProjectPayment({ payload: projectPayment, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateProjectPayment, projectPayment);
    yield put(updateProjectPaymentSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(projectPayment));
    }
    toast.success(`projectPayment ${projectPayment.prp_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateProjectPaymentFail(error));
    toast.error(`projectPayment ${projectPayment.prp_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteProjectPayment({ payload: projectPayment }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteProjectPayment, projectPayment);
    yield put(deleteProjectPaymentSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(projectPayment));
    }
    toast.success(`projectPayment ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteProjectPaymentFail(error));
    toast.error(`projectPayment ${projectPayment.prp_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddProjectPayment({ payload: projectPayment, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addProjectPayment, projectPayment);

    yield put(addProjectPaymentSuccess(response.data));
    toast.success(`projectPayment ${response.data.prp_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addProjectPaymentFail(error));
    toast.error("projectPayment Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ProjectPaymentSaga() {
  yield takeEvery(GET_PROJECT_PAYMENT, fetchProjectPayment);
  yield takeEvery(ADD_PROJECT_PAYMENT, onAddProjectPayment);
  yield takeEvery(UPDATE_PROJECT_PAYMENT, onUpdateProjectPayment);
  yield takeEvery(DELETE_PROJECT_PAYMENT, onDeleteProjectPayment);
}

export default ProjectPaymentSaga;
