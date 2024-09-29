import {
  GET_PAGES_FAIL,
  GET_PAGES_SUCCESS,
  ADD_PAGES_SUCCESS,
  ADD_PAGES_FAIL,
  UPDATE_PAGES_SUCCESS,
  UPDATE_PAGES_FAIL,
  DELETE_PAGES_SUCCESS,
  DELETE_PAGES_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  pages: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const PagesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAGES_SUCCESS:
      return {
        ...state,
        pages: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PAGES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PAGES_SUCCESS:
      return {
        ...state,
        pages: {
          ...state.pages,
          data: [action.payload, ...state.pages.data],
        },
      };

    case ADD_PAGES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PAGES_SUCCESS:
      return {
        ...state,
        pages: {
          ...state.pages,
          data: state.pages.data.map((PAGES) =>
            PAGES.pag_id.toString() === action.payload.pag_id.toString()
              ? { ...PAGES, ...action.payload } // Update the specific PAGES
              : PAGES
          ),
        },
      };

    case UPDATE_PAGES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PAGES_SUCCESS:
      return {
        ...state,
        pages: {
          ...state.pages,
          data: state.pages.data.filter(
            (PAGES) =>
              PAGES.pag_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PAGES_FAIL:
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

export default PagesReducer;
