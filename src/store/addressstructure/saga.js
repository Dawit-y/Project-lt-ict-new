import { call, put, takeEvery, select } from "redux-saga/effects";

// addressStructure Redux States
import {
  GET_ADDRESS_STRUCTURE,
  ADD_ADDRESS_STRUCTURE,
  DELETE_ADDRESS_STRUCTURE,
  UPDATE_ADDRESS_STRUCTURE,
} from "./actionTypes";
import {
  getAddressStructureFail,
  getAddressStructureSuccess,
  addAddressStructureFail,
  addAddressStructureSuccess,
  updateAddressStructureSuccess,
  updateAddressStructureFail,
  deleteAddressStructureSuccess,
  deleteAddressStructureFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getAddressStructure,
  addAddressStructure,
  updateAddressStructure,
  deleteAddressStructure,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/addressstructure_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.AddressStructureR.show_result;

function* fetchAddressStructure() {
  try {
    const response = yield call(getAddressStructure);
    yield put(getAddressStructureSuccess(response));
    // toast.success(`addressStructures Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getAddressStructureFail(error));
  }
}

function* onUpdateAddressStructure({ payload: addressStructure, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateAddressStructure, addressStructure);
    yield put(updateAddressStructureSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(addressStructure));
    }
    toast.success(`addressStructure ${addressStructure.add_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateAddressStructureFail(error));
    toast.error(`addressStructure ${addressStructure.add_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteAddressStructure({ payload: addressStructure }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteAddressStructure, addressStructure);
    yield put(deleteAddressStructureSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(addressStructure));
    }
    toast.success(`addressStructure ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteAddressStructureFail(error));
    toast.error(`addressStructure ${addressStructure.add_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddAddressStructure({ payload: addressStructure, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addAddressStructure, addressStructure);

    yield put(addAddressStructureSuccess(response.data));
    toast.success(`addressStructure ${response.data.add_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addAddressStructureFail(error));
    toast.error("addressStructure Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* AddressStructureSaga() {
  yield takeEvery(GET_ADDRESS_STRUCTURE, fetchAddressStructure);
  yield takeEvery(ADD_ADDRESS_STRUCTURE, onAddAddressStructure);
  yield takeEvery(UPDATE_ADDRESS_STRUCTURE, onUpdateAddressStructure);
  yield takeEvery(DELETE_ADDRESS_STRUCTURE, onDeleteAddressStructure);
}

export default AddressStructureSaga;
