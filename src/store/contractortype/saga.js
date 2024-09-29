import { call, put, takeEvery, select } from "redux-saga/effects";

// contractorType Redux States
import {
  GET_CONTRACTOR_TYPE,
  ADD_CONTRACTOR_TYPE,
  DELETE_CONTRACTOR_TYPE,
  UPDATE_CONTRACTOR_TYPE,
} from "./actionTypes";
import {
  getContractorTypeFail,
  getContractorTypeSuccess,
  addContractorTypeFail,
  addContractorTypeSuccess,
  updateContractorTypeSuccess,
  updateContractorTypeFail,
  deleteContractorTypeSuccess,
  deleteContractorTypeFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getContractorType,
  addContractorType,
  updateContractorType,
  deleteContractorType,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/contractortype_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.ContractorTypeR.show_result;

function* fetchContractorType() {
  try {
    const response = yield call(getContractorType);
    yield put(getContractorTypeSuccess(response));
    // toast.success(`contractorTypes Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getContractorTypeFail(error));
  }
}

function* onUpdateContractorType({ payload: contractorType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateContractorType, contractorType);
    yield put(updateContractorTypeSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(contractorType));
    }
    toast.success(`contractorType ${contractorType.cnt_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateContractorTypeFail(error));
    toast.error(`contractorType ${contractorType.cnt_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteContractorType({ payload: contractorType }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteContractorType, contractorType);
    yield put(deleteContractorTypeSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(contractorType));
    }
    toast.success(`contractorType ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteContractorTypeFail(error));
    toast.error(`contractorType ${contractorType.cnt_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddContractorType({ payload: contractorType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addContractorType, contractorType);

    yield put(addContractorTypeSuccess(response.data));
    toast.success(`contractorType ${response.data.cnt_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addContractorTypeFail(error));
    toast.error("contractorType Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* ContractorTypeSaga() {
  yield takeEvery(GET_CONTRACTOR_TYPE, fetchContractorType);
  yield takeEvery(ADD_CONTRACTOR_TYPE, onAddContractorType);
  yield takeEvery(UPDATE_CONTRACTOR_TYPE, onUpdateContractorType);
  yield takeEvery(DELETE_CONTRACTOR_TYPE, onDeleteContractorType);
}

export default ContractorTypeSaga;
