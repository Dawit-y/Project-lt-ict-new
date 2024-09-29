

import { call, put, takeEvery, select } from "redux-saga/effects";

// documentType Redux States
import {
  GET_DOCUMENT_TYPE,
  ADD_DOCUMENT_TYPE,
  DELETE_DOCUMENT_TYPE,
  UPDATE_DOCUMENT_TYPE,
} from "./actionTypes";
import {
  getDocumentTypeFail,
  getDocumentTypeSuccess,
  addDocumentTypeFail,
  addDocumentTypeSuccess,
  updateDocumentTypeSuccess,
  updateDocumentTypeFail,
  deleteDocumentTypeSuccess,
  deleteDocumentTypeFail,
  toggleUpdateLoading,
} from "./actions";

import { deleteSearchResult, updateSearchResults } from "../search/action";

//Include Both Helper File with needed methods
import {
  getDocumentType,
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "../../helpers/documenttype_backend_helper";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectShowResult = (state) => state.DocumentTypeR.show_result;

function* fetchDocumentType() {
  try {
    const response = yield call(getDocumentType);
    yield put(getDocumentTypeSuccess(response));
    // toast.success(`documentTypes Loading  Successfully`, { autoClose: 2000 });
  } catch (error) {
    yield put(getDocumentTypeFail(error));
  }
}

function* onUpdateDocumentType({ payload: documentType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(updateDocumentType, documentType);
    yield put(updateDocumentTypeSuccess(response.data));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(updateSearchResults(documentType));
    }
    toast.success(
      `documentType ${documentType.pdt_id} Is Updated Successfully`,
      {
        autoClose: 2000,
      }
    );
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(updateDocumentTypeFail(error));
    toast.error(`documentType ${documentType.pdt_id} Is Update Failed`, {
      autoClose: 2000,
    });

    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onDeleteDocumentType({ payload: documentType }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(deleteDocumentType, documentType);
    yield put(deleteDocumentTypeSuccess(response));
    const showResult = yield select(selectShowResult);

    if (showResult) {
      yield put(deleteSearchResult(documentType));
    }
    toast.success(
      `documentType ${response.deleted_id} Is Delete Successfully`,
      {
        autoClose: 2000,
      }
    );
  } catch (error) {
    yield put(deleteDocumentTypeFail(error));
    toast.error(`documentType ${documentType.pdt_id} Is Delete Failed`, {
      autoClose: 2000,
    });
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* onAddDocumentType({ payload: documentType, modalCallback }) {
  try {
    yield put(toggleUpdateLoading(true));
    const response = yield call(addDocumentType, documentType);

    yield put(addDocumentTypeSuccess(response.data));
    toast.success(
      `documentType ${response.data.pdt_id} Is Added Successfully`,
      {
        autoClose: 2000,
      }
    );
    if (modalCallback) modalCallback();
  } catch (error) {
    yield put(addDocumentTypeFail(error));
    toast.error("documentType Added Failed", { autoClose: 2000 });
    if (modalCallback) modalCallback();
  } finally {
    yield put(toggleUpdateLoading(false));
  }
}

function* DocumentTypeSaga() {
  yield takeEvery(GET_DOCUMENT_TYPE, fetchDocumentType);
  yield takeEvery(ADD_DOCUMENT_TYPE, onAddDocumentType);
  yield takeEvery(UPDATE_DOCUMENT_TYPE, onUpdateDocumentType);
  yield takeEvery(DELETE_DOCUMENT_TYPE, onDeleteDocumentType);
}

export default DocumentTypeSaga;
