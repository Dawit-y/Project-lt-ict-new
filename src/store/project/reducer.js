import {
  GET_PROJECT_FAIL,
  GET_PROJECT_SUCCESS,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  project: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          data: [action.payload, ...state.project.data],
        },
      };

    case ADD_PROJECT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          data: state.project.data.map((PROJECT) =>
            PROJECT.prj_id.toString() === action.payload.prj_id.toString()
              ? { ...PROJECT, ...action.payload } // Update the specific PROJECT
              : PROJECT
          ),
        },
      };

    case UPDATE_PROJECT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          data: state.project.data.filter(
            (PROJECT) =>
              PROJECT.prj_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_FAIL:
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

export default ProjectReducer;
