import {
  GET_PROJECT_CATEGORY_FAIL,
  GET_PROJECT_CATEGORY_SUCCESS,
  ADD_PROJECT_CATEGORY_SUCCESS,
  ADD_PROJECT_CATEGORY_FAIL,
  UPDATE_PROJECT_CATEGORY_SUCCESS,
  UPDATE_PROJECT_CATEGORY_FAIL,
  DELETE_PROJECT_CATEGORY_SUCCESS,
  DELETE_PROJECT_CATEGORY_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectCategory: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectCategoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_CATEGORY_SUCCESS:
      return {
        ...state,
        projectCategory: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_CATEGORY_SUCCESS:
      return {
        ...state,
        projectCategory: {
          ...state.projectCategory,
          data: [action.payload, ...state.projectCategory.data],
        },
      };

    case ADD_PROJECT_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_CATEGORY_SUCCESS:
      return {
        ...state,
        projectCategory: {
          ...state.projectCategory,
          data: state.projectCategory.data.map((PROJECT_CATEGORY) =>
            PROJECT_CATEGORY.pct_id.toString() === action.payload.pct_id.toString()
              ? { ...PROJECT_CATEGORY, ...action.payload } // Update the specific PROJECT_CATEGORY
              : PROJECT_CATEGORY
          ),
        },
      };

    case UPDATE_PROJECT_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_CATEGORY_SUCCESS:
      return {
        ...state,
        projectCategory: {
          ...state.projectCategory,
          data: state.projectCategory.data.filter(
            (PROJECT_CATEGORY) =>
              PROJECT_CATEGORY.pct_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_CATEGORY_FAIL:
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

export default ProjectCategoryReducer;
