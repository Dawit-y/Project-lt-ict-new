import { call, put, takeEvery, select } from "redux-saga/effects";

// stakeholderType Redux States
import {
  GET_STAKEHOLDER_TYPE,
  ADD_STAKEHOLDER_TYPE,
  DELETE_STAKEHOLDER_TYPE,
  UPDATE_STAKEHOLDER_TYPE,
} from "./actionTypes";
import {
  getStakeholderTypeFail,
  getStakeholderTypeSuccess,
  addStakeholderTypeFail,
  addStakeholderTypeSuccess,
  updateStakeholderTypeSuccess,
  updateStakeholderTypeFail,
  deleteStakeholderTypeSuccess,
  deleteStakeholderTypeFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getStakeholderType,
  addStakeholderType,
  updateStakeholderType,
  deleteStakeholderType,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/stakeholdertype_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.StakeholderTypeR.show_result;

function* fetchStakeholderType() {
  try {
    const response = yield call(getStakeholderType);
    yield put(getStakeholderTypeSuccess(response));
    // toast.success(`stakeholderTypes Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getStakeholderTypeFail(error));
  }
}

function* onUpdateStakeholderType({ payload: stakeholderType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateStakeholderType, stakeholderType);
    yield put(updateStakeholderTypeSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(stakeholderType));
    }
    toast.success(`stakeholderType ${stakeholderType.sht_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateStakeholderTypeFail(error));
    toast.error(`stakeholderType ${stakeholderType.sht_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteStakeholderType({ payload: stakeholderType }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteStakeholderType, stakeholderType);
    yield put(deleteStakeholderTypeSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(stakeholderType));
    }
    toast.success(`stakeholderType ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteStakeholderTypeFail(error));
    toast.error(`stakeholderType ${stakeholderType.sht_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddStakeholderType({ payload: stakeholderType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addStakeholderType, stakeholderType);

    yield put(addStakeholderTypeSuccess(response.data));
    toast.success(`stakeholderType ${response.data.sht_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addStakeholderTypeFail(error));
    toast.error("stakeholderType Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* StakeholderTypeSaga() {
  yield takeEvery(GET_STAKEHOLDER_TYPE, fetchStakeholderType);
  yield takeEvery(ADD_STAKEHOLDER_TYPE, onAddStakeholderType);
  yield takeEvery(UPDATE_STAKEHOLDER_TYPE, onUpdateStakeholderType);
  yield takeEvery(DELETE_STAKEHOLDER_TYPE, onDeleteStakeholderType);
}

export default StakeholderTypeSaga;
