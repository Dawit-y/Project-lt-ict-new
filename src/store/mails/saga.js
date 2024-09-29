import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MAILS_LIST,
  GET_SELECTED_MAILS,
  SET_FOLDER_SELECTED_MAILS,
  SELECT_FOLDER,
  DELETE_MAIL,
  TRASH_MAIL,
  STARED_MAIL,
  GET_MAIL_ID
} from "./actionTypes";

import {
  getMailsListsSuccess,
  getMailsListsFail,
  getSelectedMailsSuccess,
  getSelectedMailsFail,
  setFolderOnSelectedMailsSuccess,
  setFolderOnSelectedMailsFail,
  selectFoldersSuccess,
  selectFoldersFail,
  deleteMailSuccess,
  deleteMailFail,
  trashMailFail,
  trashMailSuccess,
  staredMailSuccess,
  staredMailFail,
  getMailsListsIdSuccess,
  getMailsListsIdFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getMailsLists,
  getselectedmails,
  setfolderonmails,
  selectFolders,
  deleteMail,
  trashMail,
  staredMail,
  getMailsListsId
} from "../../helpers/Project_Backend";

function* fetchMailsLists({ payload: filter }) {
  try {
    const response = yield call(getMailsLists, filter);
    yield put(getMailsListsSuccess(response));
  } catch (error) {
    yield put(getMailsListsFail(error));
  }
}

function* onSelectFolders() {
  try {
    const response = yield call(selectFolders);
    yield put(selectFoldersSuccess(response));
  } catch (error) {
    yield put(selectFoldersFail(error));
  }
}

function* onGetSelectedMails({ payload: selectedmails }) {
  try {
    const response = yield call(getselectedmails, selectedmails);
    yield put(getSelectedMailsSuccess(response));
  } catch (error) {
    yield put(getSelectedMailsFail(error));
  }
}

function* onSetFolderOnSelectedMails({ payload: { selectedmails, folderId, activeTab } }) {
  try {
    const response = yield call(setfolderonmails, selectedmails, folderId);
    yield put(setFolderOnSelectedMailsSuccess(response));

    try {
      const newresponse = yield call(getMailsLists, parseInt(activeTab));
      yield put(getMailsListsSuccess(newresponse));
    } catch (error) {
      yield put(getMailsListsFail(error));
    }

    try {
      const response = yield call(getselectedmails, null);
      yield put(getSelectedMailsSuccess(response));
    } catch (error) {
      yield put(getSelectedMailsFail(error));
    }

  } catch (error) {
    yield put(setFolderOnSelectedMailsFail(error));
  }
}

function* onDeleteMail({ payload: mail }) {
  try {
    const response = yield call(deleteMail, mail)
    yield put(deleteMailSuccess(response));
  } catch (error) {
    yield put(deleteMailFail(error))
  }
}

function* onTrashMail({ payload: mail }) {
  try {
    const response = yield call(trashMail, mail)
    yield put(trashMailSuccess(response));
  } catch (error) {
    yield put(trashMailFail(error))
  }
}

function* onStaredMail({ payload: mail }) {
  try {
    const response = yield call(staredMail, mail)
    yield put(staredMailSuccess(response));
  } catch (error) {
    yield put(staredMailFail(error))
  }
}

function* onGetMailsListsId({ payload: mail }) {
  try {
    const response = yield call(getMailsListsId, mail)
    yield put(getMailsListsIdSuccess(response));
  } catch (error) {
    yield put(getMailsListsIdFail(error))
  }
}

function* mailsSaga() {
  yield takeEvery(GET_MAILS_LIST, fetchMailsLists),
    yield takeEvery(SELECT_FOLDER, onSelectFolders),
    yield takeEvery(GET_SELECTED_MAILS, onGetSelectedMails),
    yield takeEvery(SET_FOLDER_SELECTED_MAILS, onSetFolderOnSelectedMails),
    yield takeEvery(DELETE_MAIL, onDeleteMail),
    yield takeEvery(TRASH_MAIL, onTrashMail),
    yield takeEvery(STARED_MAIL, onStaredMail)
  yield takeEvery(GET_MAIL_ID, onGetMailsListsId)

}

export default mailsSaga;