import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
    GET_DASHBOARD_EMAILCHART
} from "./actionTypes";
import { apiSuccess, apiFail } from "./actions";

//Include Both Helper File with needed methods
import { getDashboardEmailChart as getDashboardEmailChartApi }
    from "../../helpers/Project_Backend";

function* getChartsData({ payload: periodType }) {
    try {
        var response = yield call(getDashboardEmailChartApi, periodType);

        yield put(apiSuccess(GET_DASHBOARD_EMAILCHART, response));
    } catch (error) {
        yield put(apiFail(GET_DASHBOARD_EMAILCHART, error));
    }
}

export function* watchGetChartsData() {
    yield takeEvery(GET_DASHBOARD_EMAILCHART, getChartsData);
}

function* dashboardSaga() {
    yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
