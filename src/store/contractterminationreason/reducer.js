import {
  GET_CONTRACT_TERMINATION_REASON_FAIL,
  GET_CONTRACT_TERMINATION_REASON_SUCCESS,
  ADD_CONTRACT_TERMINATION_REASON_SUCCESS,
  ADD_CONTRACT_TERMINATION_REASON_FAIL,
  UPDATE_CONTRACT_TERMINATION_REASON_SUCCESS,
  UPDATE_CONTRACT_TERMINATION_REASON_FAIL,
  DELETE_CONTRACT_TERMINATION_REASON_SUCCESS,
  DELETE_CONTRACT_TERMINATION_REASON_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  contractTerminationReason: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ContractTerminationReasonReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTRACT_TERMINATION_REASON_SUCCESS:
      return {
        ...state,
        contractTerminationReason: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_CONTRACT_TERMINATION_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_CONTRACT_TERMINATION_REASON_SUCCESS:
      return {
        ...state,
        contractTerminationReason: {
          ...state.contractTerminationReason,
          data: [action.payload, ...state.contractTerminationReason.data],
        },
      };

    case ADD_CONTRACT_TERMINATION_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CONTRACT_TERMINATION_REASON_SUCCESS:
      return {
        ...state,
        contractTerminationReason: {
          ...state.contractTerminationReason,
          data: state.contractTerminationReason.data.map((CONTRACT_TERMINATION_REASON) =>
            CONTRACT_TERMINATION_REASON.ctr_id.toString() === action.payload.ctr_id.toString()
              ? { ...CONTRACT_TERMINATION_REASON, ...action.payload } // Update the specific CONTRACT_TERMINATION_REASON
              : CONTRACT_TERMINATION_REASON
          ),
        },
      };

    case UPDATE_CONTRACT_TERMINATION_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CONTRACT_TERMINATION_REASON_SUCCESS:
      return {
        ...state,
        contractTerminationReason: {
          ...state.contractTerminationReason,
          data: state.contractTerminationReason.data.filter(
            (CONTRACT_TERMINATION_REASON) =>
              CONTRACT_TERMINATION_REASON.ctr_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_CONTRACT_TERMINATION_REASON_FAIL:
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

export default ContractTerminationReasonReducer;
