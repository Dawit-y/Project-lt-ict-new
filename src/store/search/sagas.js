import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { PERFORM_SEARCH_REQUEST } from "./actionTypes";
import { performSearchSuccess, performSearchFail } from "./action";
import { fetchSearchResults } from "../../helpers/Project_Backend";

function* performSearchSaga(action) {
  try {
    const { searchTerm, selectedFields } = action.payload;
    const results = yield call(fetchSearchResults, searchTerm, selectedFields);
    yield put(performSearchSuccess(results));
  } catch (error) {
    yield put(performSearchFail(error));
  }
}
export default function* watchSearchSaga() {
  yield takeEvery(PERFORM_SEARCH_REQUEST, performSearchSaga);
}
