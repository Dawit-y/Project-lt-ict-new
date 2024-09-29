import {
    API_SUCCESS,
    API_FAIL,
    // GET_CHARTS_DATA,
    GET_DASHBOARD_EMAILCHART
} from "./actionTypes";

export const apiSuccess = (actionType, data) => ({
    type: API_SUCCESS,
    payload: { actionType, data },
});

export const apiFail = (actionType, error) => ({
    type: API_FAIL,
    payload: { actionType, error },
});

// charts data
export const getChartsData = (periodType) => ({
    type: GET_DASHBOARD_EMAILCHART,
    payload: periodType
});
