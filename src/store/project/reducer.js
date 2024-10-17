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
  SELECT_PROJECT,
  FETCH_SINGLE_PROJECT_FAIL,
  FETCH_SINGLE_PROJECT_REQUEST,
  FETCH_SINGLE_PROJECT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  project: {
    data: [],
    previledge: {},
  },
  selectedProject: null,
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

    case SELECT_PROJECT: // Handle the new action
      return {
        ...state,
        selectedProject: state.project.data.find(
          (PROJECT) => PROJECT.prj_id.toString() === action.payload.toString()
        ), // Find and set the selected project
      };

    case FETCH_SINGLE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true, // Optionally, you can manage loading state
      };

    case FETCH_SINGLE_PROJECT_SUCCESS:
      return {
        ...state,
        selectedProject: action.payload, // Set the selected project
        loading: false,
      };

    case FETCH_SINGLE_PROJECT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default ProjectReducer;
