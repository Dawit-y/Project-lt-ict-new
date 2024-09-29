import {
  GET_CONTRACTOR_TYPE_FAIL,
  GET_CONTRACTOR_TYPE_SUCCESS,
  ADD_CONTRACTOR_TYPE_SUCCESS,
  ADD_CONTRACTOR_TYPE_FAIL,
  UPDATE_CONTRACTOR_TYPE_SUCCESS,
  UPDATE_CONTRACTOR_TYPE_FAIL,
  DELETE_CONTRACTOR_TYPE_SUCCESS,
  DELETE_CONTRACTOR_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  contractorType: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ContractorTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTRACTOR_TYPE_SUCCESS:
      return {
        ...state,
        contractorType: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_CONTRACTOR_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_CONTRACTOR_TYPE_SUCCESS:
      return {
        ...state,
        contractorType: {
          ...state.contractorType,
          data: [action.payload, ...state.contractorType.data],
        },
      };

    case ADD_CONTRACTOR_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CONTRACTOR_TYPE_SUCCESS:
      return {
        ...state,
        contractorType: {
          ...state.contractorType,
          data: state.contractorType.data.map((CONTRACTOR_TYPE) =>
            CONTRACTOR_TYPE.cnt_id.toString() === action.payload.cnt_id.toString()
              ? { ...CONTRACTOR_TYPE, ...action.payload } // Update the specific CONTRACTOR_TYPE
              : CONTRACTOR_TYPE
          ),
        },
      };

    case UPDATE_CONTRACTOR_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CONTRACTOR_TYPE_SUCCESS:
      return {
        ...state,
        contractorType: {
          ...state.contractorType,
          data: state.contractorType.data.filter(
            (CONTRACTOR_TYPE) =>
              CONTRACTOR_TYPE.cnt_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_CONTRACTOR_TYPE_FAIL:
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

export default ContractorTypeReducer;
