import { call, put, takeEvery, select } from "redux-saga/effects";

// pages Redux States
import {
  GET_PAGES,
  ADD_PAGES,
  DELETE_PAGES,
  UPDATE_PAGES,
} from "./actionTypes";
import {
  getPagesFail,
  getPagesSuccess,
  addPagesFail,
  addPagesSuccess,
  updatePagesSuccess,
  updatePagesFail,
  deletePagesSuccess,
  deletePagesFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getPages,
  addPages,
  updatePages,
  deletePages,

  // getProductComents as getProductComentsApi,
  // onLikeComment as onLikeCommentApi,
  // onLikeReply as onLikeReplyApi,
  // onAddReply as onAddReplyApi,
  // onAddComment as onAddCommentApi,
} from "../../helpers/pages_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.PagesR.show_result;

function* fetchPages() {
  try {
    const response = yield call(getPages);
    yield put(getPagesSuccess(response));
    // toast.success(`pagess Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getPagesFail(error));
  }
}

function* onUpdatePages({ payload: pages, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updatePages, pages);
    yield put(updatePagesSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(pages));
    }
    toast.success(`pages ${pages.pag_id} Is Updated Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updatePagesFail(error));
    toast.error(`pages ${pages.pag_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeletePages({ payload: pages }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deletePages, pages);
    yield put(deletePagesSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(pages));
    }
    toast.success(`pages ${response.deleted_id} Is Delete Successfully`, {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(deletePagesFail(error));
    toast.error(`pages ${pages.pag_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddPages({ payload: pages, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addPages, pages);

    yield put(addPagesSuccess(response.data));
    toast.success(`pages ${response.data.pag_id} Is Added Successfully`, {
      autoClose: 2000,
    });
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addPagesFail(error));
    toast.error("pages Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* PagesSaga() {
  yield takeEvery(GET_PAGES, fetchPages);
  yield takeEvery(ADD_PAGES, onAddPages);
  yield takeEvery(UPDATE_PAGES, onUpdatePages);
  yield takeEvery(DELETE_PAGES, onDeletePages);
}

export default PagesSaga;
