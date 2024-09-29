import {
  GET_ACCESS_LOG_FAIL,
  GET_ACCESS_LOG_SUCCESS,
  ADD_ACCESS_LOG_SUCCESS,
  ADD_ACCESS_LOG_FAIL,
  UPDATE_ACCESS_LOG_SUCCESS,
  UPDATE_ACCESS_LOG_FAIL,
  DELETE_ACCESS_LOG_SUCCESS,
  DELETE_ACCESS_LOG_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  accessLog: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const AccessLogReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACCESS_LOG_SUCCESS:
      return {
        ...state,
        accessLog: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_ACCESS_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_ACCESS_LOG_SUCCESS:
      return {
        ...state,
        accessLog: {
          ...state.accessLog,
          data: [action.payload, ...state.accessLog.data],
        },
      };

    case ADD_ACCESS_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ACCESS_LOG_SUCCESS:
      return {
        ...state,
        accessLog: {
          ...state.accessLog,
          data: state.accessLog.data.map((ACCESS_LOG) =>
            ACCESS_LOG.acl_id.toString() === action.payload.acl_id.toString()
              ? { ...ACCESS_LOG, ...action.payload } // Update the specific ACCESS_LOG
              : ACCESS_LOG
          ),
        },
      };

    case UPDATE_ACCESS_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ACCESS_LOG_SUCCESS:
      return {
        ...state,
        accessLog: {
          ...state.accessLog,
          data: state.accessLog.data.filter(
            (ACCESS_LOG) =>
              ACCESS_LOG.acl_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_ACCESS_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case TOGGLE_UPDATE_LOADING:
      return {
        ...state,
        update_loading: action.payload,
      };

    default:
      return state;
  }
};

export default AccessLogReducer;
