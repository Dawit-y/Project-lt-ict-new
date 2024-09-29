import {
  GET_PROJECT_PAYMENT_FAIL,
  GET_PROJECT_PAYMENT_SUCCESS,
  ADD_PROJECT_PAYMENT_SUCCESS,
  ADD_PROJECT_PAYMENT_FAIL,
  UPDATE_PROJECT_PAYMENT_SUCCESS,
  UPDATE_PROJECT_PAYMENT_FAIL,
  DELETE_PROJECT_PAYMENT_SUCCESS,
  DELETE_PROJECT_PAYMENT_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectPayment: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectPaymentReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_PAYMENT_SUCCESS:
      return {
        ...state,
        projectPayment: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_PAYMENT_SUCCESS:
      return {
        ...state,
        projectPayment: {
          ...state.projectPayment,
          data: [action.payload, ...state.projectPayment.data],
        },
      };

    case ADD_PROJECT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_PAYMENT_SUCCESS:
      return {
        ...state,
        projectPayment: {
          ...state.projectPayment,
          data: state.projectPayment.data.map((PROJECT_PAYMENT) =>
            PROJECT_PAYMENT.prp_id.toString() === action.payload.prp_id.toString()
              ? { ...PROJECT_PAYMENT, ...action.payload } // Update the specific PROJECT_PAYMENT
              : PROJECT_PAYMENT
          ),
        },
      };

    case UPDATE_PROJECT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_PAYMENT_SUCCESS:
      return {
        ...state,
        projectPayment: {
          ...state.projectPayment,
          data: state.projectPayment.data.filter(
            (PROJECT_PAYMENT) =>
              PROJECT_PAYMENT.prp_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_PAYMENT_FAIL:
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

export default ProjectPaymentReducer;
