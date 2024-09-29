import {
    API_SUCCESS,
    API_FAIL,
    GET_DASHBOARD_EMAILCHART
} from "./actionTypes";

const INIT_STATE = {
    chartsData: []
};

const Dashboard = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_SUCCESS:
            switch (action.payload.actionType) {
                case GET_DASHBOARD_EMAILCHART:
                    return {
                        ...state,
                        chartsData: action.payload.data
                    };
                default:
                    return state;
            }
        case API_FAIL:
            switch (action.payload.actionType) {
                case GET_DASHBOARD_EMAILCHART:
                    return {
                        ...state,
                        chartsDataError: action.payload.error
                    };


                default:
                    return state;
            }
        default:
            return state;
    }
}


export default Dashboard;