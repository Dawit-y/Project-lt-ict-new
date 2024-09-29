import {
  GET_MAILS_LIST,
  GET_MAILS_LIST_FAIL,
  GET_MAILS_LIST_SUCCESS,
  GET_SELECTED_MAILS,
  GET_SELECTED_MAILS_SUCCESS,
  GET_SELECTED_MAILS_FAIL,
  SET_FOLDER_SELECTED_MAILS,
  SET_FOLDER_SELECTED_MAILS_SUCCESS,
  SET_FOLDER_SELECTED_MAILS_FAIL,
  SELECT_FOLDER,
  SELECT_FOLDER_SUCCESS,
  SELECT_FOLDER_FAIL,
  DELETE_MAIL_SUCCESS,
  DELETE_MAIL_FAIL,
  DELETE_MAIL,
  TRASH_MAIL,
  TRASH_MAIL_SUCCESS,
  TRASH_MAIL_FAIL,
  STARED_MAIL_SUCCESS,
  STARED_MAIL_FAIL,
  STARED_MAIL,
  GET_MAIL_ID,
  GET_MAIL_ID_SUCCESS,
  GET_MAIL_ID_FAIL
} from "./actionTypes";

export const getMailsLists = (filter) => ({
  type: GET_MAILS_LIST,
  payload: filter,
});

export const getMailsListsSuccess = mailslists => ({
  type: GET_MAILS_LIST_SUCCESS,
  payload: mailslists,
});

export const getMailsListsFail = error => ({
  type: GET_MAILS_LIST_FAIL,
  payload: error,
});

export const getSelectedMails = (selectedmails) => ({
  type: GET_SELECTED_MAILS,
  payload: selectedmails
});

export const getSelectedMailsSuccess = (selectedmails) => ({
  type: GET_SELECTED_MAILS_SUCCESS,
  payload: selectedmails,
});

export const getSelectedMailsFail = error => ({
  type: GET_SELECTED_MAILS_FAIL,
  payload: error,
});

export const setFolderOnSelectedMails = (selectedmails, folderId, activeTab) => ({
  type: SET_FOLDER_SELECTED_MAILS,
  payload: { selectedmails, folderId, activeTab }
});

export const setFolderOnSelectedMailsSuccess = () => ({
  type: SET_FOLDER_SELECTED_MAILS_SUCCESS
});

export const setFolderOnSelectedMailsFail = error => ({
  type: SET_FOLDER_SELECTED_MAILS_FAIL,
  payload: error,
});

export const selectFolders = () => ({
  type: SELECT_FOLDER
});

export const selectFoldersSuccess = folders => ({
  type: SELECT_FOLDER_SUCCESS,
  payload: folders,
});

export const selectFoldersFail = error => ({
  type: SELECT_FOLDER_FAIL,
  payload: error,
});

export const deleteMail = mail => ({
  type: DELETE_MAIL,
  payload: mail
})

export const deleteMailSuccess = mail => ({
  type: DELETE_MAIL_SUCCESS,
  payload: mail
})

export const deleteMailFail = error => ({
  type: DELETE_MAIL_FAIL,
  payload: error
})

export const trashMail = mail => ({
  type: TRASH_MAIL,
  payload: mail
})

export const trashMailSuccess = mail => ({
  type: TRASH_MAIL_SUCCESS,
  payload: mail
})

export const trashMailFail = error => ({
  type: TRASH_MAIL_FAIL,
  payload: error
})

export const staredMail = mail => ({
  type: STARED_MAIL,
  payload: mail
})

export const staredMailSuccess = mail => ({
  type: STARED_MAIL_SUCCESS,
  payload: mail
})

export const staredMailFail = error => ({
  type: STARED_MAIL_FAIL,
  payload: error
})

export const getMailsListsId = mail => ({
  type: GET_MAIL_ID,
  payload: mail
})

export const getMailsListsIdSuccess = mail => ({
  type: GET_MAIL_ID_SUCCESS,
  payload: mail
})

export const getMailsListsIdFail = error => ({
  type: GET_MAIL_ID_FAIL,
  payload: error
})
