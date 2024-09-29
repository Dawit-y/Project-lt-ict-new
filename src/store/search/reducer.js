import {
  PERFORM_SEARCH_REQUEST,
  PERFORM_SEARCH_SUCCESS,
  PERFORM_SEARCH_FAIL,
  UPDATE_SEARCH_RESULTS,
  DELETE_SEARCH_RESULT,
} from "./actionTypes";

const initialState = {
  searchTerm: {},
  selectedFields: [],
  results: [],
  error: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case PERFORM_SEARCH_REQUEST:
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
        selectedFields: action.payload.selectedFields,
      };

    case PERFORM_SEARCH_SUCCESS:
      return {
        ...state,
        results: action.payload,
      };

    case PERFORM_SEARCH_FAIL:
      return {
        ...state,
        error: action.payload.error,
      };

    case UPDATE_SEARCH_RESULTS:
      return {
        ...state,
        results: state.results.map((result) =>
          result.prs_id === action.payload.prs_id ? action.payload : result
        ),
      };

    case DELETE_SEARCH_RESULT:
      return {
        ...state,
        results: state.results.filter(
          (result) => result.prs_id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default searchReducer;
