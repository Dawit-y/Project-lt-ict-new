import { call, put, takeEvery, select } from "redux-saga/effects";

// sectorCategory Redux States
import {
  GET_SECTOR_CATEGORY,
  ADD_SECTOR_CATEGORY,
  DELETE_SECTOR_CATEGORY,
  UPDATE_SECTOR_CATEGORY,
} from "./actionTypes";
import {
  getSectorCategoryFail,
  getSectorCategorySuccess,
  addSectorCategoryFail,
  addSectorCategorySuccess,
  updateSectorCategorySuccess,
  updateSectorCategoryFail,
  deleteSectorCategorySuccess,
  deleteSectorCategoryFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getSectorCategory,
  addSectorCategory,
  updateSectorCategory,
  deleteSectorCategory,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/sectorcategory_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.SectorCategoryR.show_result;

function* fetchSectorCategory() {
  try {
    const response = yield call(getSectorCategory);
    yield put(getSectorCategorySuccess(response));
    // toast.success(`sectorCategorys Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getSectorCategoryFail(error));
  }
}

function* onUpdateSectorCategory({ payload: sectorCategory, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateSectorCategory, sectorCategory);
    yield put(updateSectorCategorySuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(sectorCategory));
    }
    toast.success(`sectorCategory ${sectorCategory.psc_delete_time} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateSectorCategoryFail(error));
    toast.error(`sectorCategory ${sectorCategory.psc_delete_time} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteSectorCategory({ payload: sectorCategory }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteSectorCategory, sectorCategory);
    yield put(deleteSectorCategorySuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(sectorCategory));
    }
    toast.success(`sectorCategory ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deleteSectorCategoryFail(error));
    toast.error(`sectorCategory ${sectorCategory.psc_delete_time} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddSectorCategory({ payload: sectorCategory, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addSectorCategory, sectorCategory);

    yield put(addSectorCategorySuccess(response.data));
    toast.success(`sectorCategory ${response.data.psc_delete_time} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addSectorCategoryFail(error));
    toast.error("sectorCategory Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* SectorCategorySaga() {
  yield takeEvery(GET_SECTOR_CATEGORY, fetchSectorCategory);
  yield takeEvery(ADD_SECTOR_CATEGORY, onAddSectorCategory);
  yield takeEvery(UPDATE_SECTOR_CATEGORY, onUpdateSectorCategory);
  yield takeEvery(DELETE_SECTOR_CATEGORY, onDeleteSectorCategory);
}

export default SectorCategorySaga;
