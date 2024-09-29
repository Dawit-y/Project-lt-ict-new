import {
  GET_PROJECT_STATUS_FAIL,
  GET_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_FAIL,
  UPDATE_PROJECT_STATUS_SUCCESS,
  UPDATE_PROJECT_STATUS_FAIL,
  DELETE_PROJECT_STATUS_SUCCESS,
  DELETE_PROJECT_STATUS_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectStatus: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectStatusReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_STATUS_SUCCESS:
      return {
        ...state,
        projectStatus: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_STATUS_SUCCESS:
      return {
        ...state,
        projectStatus: {
          ...state.projectStatus,
          data: [action.payload, ...state.projectStatus.data],
        },
      };

    case ADD_PROJECT_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_STATUS_SUCCESS:
      return {
        ...state,
        projectStatus: {
          ...state.projectStatus,
          data: state.projectStatus.data.map((PROJECT_STATUS) =>
            PROJECT_STATUS.prs_id.toString() === action.payload.prs_id.toString()
              ? { ...PROJECT_STATUS, ...action.payload } // Update the specific PROJECT_STATUS
              : PROJECT_STATUS
          ),
        },
      };

    case UPDATE_PROJECT_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_STATUS_SUCCESS:
      return {
        ...state,
        projectStatus: {
          ...state.projectStatus,
          data: state.projectStatus.data.filter(
            (PROJECT_STATUS) =>
              PROJECT_STATUS.prs_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_STATUS_FAIL:
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

export default ProjectStatusReducer;
