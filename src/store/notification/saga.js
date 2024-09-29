// saga.js
import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_NOTIFICATIONS_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
} from "./actionTypes";
import {
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationsAsReadSuccess,
  markNotificationsAsReadFailure,
} from "./actions";

import { post } from "../../helpers/api_Lists";

//helper function
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const getNotifications = async () => {
  try {
    const response = await post(apiUrl + "notification");
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};
// mark notifications helper func

const markNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await post(
      apiUrl + `updatenotification?notification_ids=${notificationIds}`
    );
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};

// Fetch notifications API call
function* fetchNotificationsSaga() {
  try {
    const response = yield call(getNotifications);
    yield put(fetchNotificationsSuccess(response));
  } catch (error) {
    yield put(fetchNotificationsFailure(error.message));
  }
}

function* markNotificationsAsReadSaga(action) {
  try {
    yield call(markNotificationsAsRead, action.payload);
    yield put(markNotificationsAsReadSuccess());
  } catch (error) {
    yield put(markNotificationsAsReadFailure(error.message));
  }
}
// Watcher Saga
export default function* notificationSaga() {
  yield takeEvery(FETCH_NOTIFICATIONS_REQUEST, fetchNotificationsSaga);
  yield takeEvery(
    MARK_NOTIFICATIONS_AS_READ_REQUEST,
    markNotificationsAsReadSaga
  );
}
