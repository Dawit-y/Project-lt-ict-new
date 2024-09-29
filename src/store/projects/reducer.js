import {
  GET_PROJECTS_STATUS_FAIL,
  GET_PROJECTS_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_SUCCESS,
  ADD_PROJECT_STATUS_FAIL,
  UPDATE_PROJECT_STATUS_SUCCESS,
  UPDATE_PROJECT_STATUS_FAIL,
  DELETE_PROJECT_STATUS_SUCCESS,
  DELETE_PROJECT_STATUS_FAIL,
  TOGGLE_UPDATE_LOADING,
  TOGGLE_SHOW_RESULT,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projects: {
    data: [],
    previledge: {},
  },
  error: {},
  show_result: false,
  loading: true,
};

const ProjectReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECTS_STATUS_SUCCESS:
      return {
        ...state,
        projects: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECTS_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_STATUS_SUCCESS:
      return {
        ...state,
        projects: {
          ...state.projects,
          data: [action.payload, ...state.projects.data],
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
        projects: {
          ...state.projects,
          data: state.projects.data.map((PROJECT) =>
            PROJECT.prs_id.toString() === action.payload.prs_id.toString()
              ? { ...PROJECT, ...action.payload } // Update the specific PROJECT
              : PROJECT
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
        projects: {
          ...state.projects,
          data: state.projects.data.filter(
            (PROJECT) =>
              PROJECT.prs_id.toString() !== action.payload.deleted_id.toString()
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
    case TOGGLE_SHOW_RESULT:
      return {
        ...state,
        show_result: action.payload,
      };

    default:
      return state;
  }
};

export default ProjectReducer;
