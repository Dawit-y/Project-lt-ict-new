import { call, put, takeEvery, select } from "redux-saga/effects";

// sectorInformation Redux States
import {
  GET_SECTOR_INFORMATION,
  ADD_SECTOR_INFORMATION,
  DELETE_SECTOR_INFORMATION,
  UPDATE_SECTOR_INFORMATION,
} from "./actionTypes";
import {
  getSectorInformationFail,
  getSectorInformationSuccess,
  addSectorInformationFail,
  addSectorInformationSuccess,
  updateSectorInformationSuccess,
  updateSectorInformationFail,
  deleteSectorInformationSuccess,
  deleteSectorInformationFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getSectorInformation,
  addSectorInformation,
  updateSectorInformation,
  deleteSectorInformation,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/sectorinformation_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.SectorInformationR.show_result;

function* fetchSectorInformation() {
  try {
    const response = yield call(getSectorInformation);
    yield put(getSectorInformationSuccess(response));
    // toast.success(`sectorInformations Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getSectorInformationFail(error));
  }
}

function* onUpdateSectorInformation({ payload: sectorInformation, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateSectorInformation, sectorInformation);
    yield put(updateSectorInformationSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(sectorInformation));
    }
    toast.success(`sectorInformation ${sectorInformation.sci_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateSectorInformationFail(error));
    toast.error(`sectorInformation ${sectorInformation.sci_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteSectorInformation({ payload: sectorInformation }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteSectorInformation, sectorInformation);
    yield put(deleteSectorInformationSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(sectorInformation));
    }
    toast.success(`sectorInformation ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteSectorInformationFail(error));
    toast.error(`sectorInformation ${sectorInformation.sci_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddSectorInformation({ payload: sectorInformation, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addSectorInformation, sectorInformation);

    yield put(addSectorInformationSuccess(response.data));
    toast.success(`sectorInformation ${response.data.sci_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addSectorInformationFail(error));
    toast.error("sectorInformation Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* SectorInformationSaga() {
  yield takeEvery(GET_SECTOR_INFORMATION, fetchSectorInformation);
  yield takeEvery(ADD_SECTOR_INFORMATION, onAddSectorInformation);
  yield takeEvery(UPDATE_SECTOR_INFORMATION, onUpdateSectorInformation);
  yield takeEvery(DELETE_SECTOR_INFORMATION, onDeleteSectorInformation);
}

export default SectorInformationSaga;
