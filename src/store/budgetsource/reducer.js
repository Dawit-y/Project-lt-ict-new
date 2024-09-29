import {
  GET_BUDGET_SOURCE_FAIL,
  GET_BUDGET_SOURCE_SUCCESS,
  ADD_BUDGET_SOURCE_SUCCESS,
  ADD_BUDGET_SOURCE_FAIL,
  UPDATE_BUDGET_SOURCE_SUCCESS,
  UPDATE_BUDGET_SOURCE_FAIL,
  DELETE_BUDGET_SOURCE_SUCCESS,
  DELETE_BUDGET_SOURCE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  budgetSource: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const BudgetSourceReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BUDGET_SOURCE_SUCCESS:
      return {
        ...state,
        budgetSource: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_BUDGET_SOURCE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_BUDGET_SOURCE_SUCCESS:
      return {
        ...state,
        budgetSource: {
          ...state.budgetSource,
          data: [action.payload, ...state.budgetSource.data],
        },
      };

    case ADD_BUDGET_SOURCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_BUDGET_SOURCE_SUCCESS:
      return {
        ...state,
        budgetSource: {
          ...state.budgetSource,
          data: state.budgetSource.data.map((BUDGET_SOURCE) =>
            BUDGET_SOURCE.pbs_id.toString() === action.payload.pbs_id.toString()
              ? { ...BUDGET_SOURCE, ...action.payload } // Update the specific BUDGET_SOURCE
              : BUDGET_SOURCE
          ),
        },
      };

    case UPDATE_BUDGET_SOURCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_BUDGET_SOURCE_SUCCESS:
      return {
        ...state,
        budgetSource: {
          ...state.budgetSource,
          data: state.budgetSource.data.filter(
            (BUDGET_SOURCE) =>
              BUDGET_SOURCE.pbs_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_BUDGET_SOURCE_FAIL:
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

export default BudgetSourceReducer;
