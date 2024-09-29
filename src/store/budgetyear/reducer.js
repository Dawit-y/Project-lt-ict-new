import {
  GET_BUDGET_YEAR_FAIL,
  GET_BUDGET_YEAR_SUCCESS,
  ADD_BUDGET_YEAR_SUCCESS,
  ADD_BUDGET_YEAR_FAIL,
  UPDATE_BUDGET_YEAR_SUCCESS,
  UPDATE_BUDGET_YEAR_FAIL,
  DELETE_BUDGET_YEAR_SUCCESS,
  DELETE_BUDGET_YEAR_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  budgetYear: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const BudgetYearReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BUDGET_YEAR_SUCCESS:
      return {
        ...state,
        budgetYear: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_BUDGET_YEAR_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_BUDGET_YEAR_SUCCESS:
      return {
        ...state,
        budgetYear: {
          ...state.budgetYear,
          data: [action.payload, ...state.budgetYear.data],
        },
      };

    case ADD_BUDGET_YEAR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_BUDGET_YEAR_SUCCESS:
      return {
        ...state,
        budgetYear: {
          ...state.budgetYear,
          data: state.budgetYear.data.map((BUDGET_YEAR) =>
            BUDGET_YEAR.bdy_id.toString() === action.payload.bdy_id.toString()
              ? { ...BUDGET_YEAR, ...action.payload } // Update the specific BUDGET_YEAR
              : BUDGET_YEAR
          ),
        },
      };

    case UPDATE_BUDGET_YEAR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_BUDGET_YEAR_SUCCESS:
      return {
        ...state,
        budgetYear: {
          ...state.budgetYear,
          data: state.budgetYear.data.filter(
            (BUDGET_YEAR) =>
              BUDGET_YEAR.bdy_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_BUDGET_YEAR_FAIL:
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

export default BudgetYearReducer;
