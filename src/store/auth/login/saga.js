import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

// //Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/Project_Backend";

// const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      if (response.status == "success") {
        sessionStorage.setItem("authUser", JSON.stringify(response));
        yield put(loginSuccess(response));
      } else {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.message
            : "Login failed, please try again.";
        yield put(apiError(errorMessage));
      }
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      sessionStorage.setItem("authUser", JSON.stringify(response));

      yield put(loginSuccess(response));
    }
    history("/dashboard");
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "Login failed, please try again.";
    yield put(apiError(errorMessage));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    // if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(fireBaseBackend.logout);
    //   yield put(logoutUserSuccess(response));
    // }
    history("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { type, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      // const fireBaseBackend = getFirebaseBackend();
      // const response = yield call(fireBaseBackend.socialLoginUser, type);
      // if (response) {
      //   history("/dashboard");
      // } else {
      //   history("/login");
      // }
      // sessionStorage.setItem("authUser", JSON.stringify(response));
      // yield put(loginSuccess(response));
      // if (response) history("/dashboard");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
