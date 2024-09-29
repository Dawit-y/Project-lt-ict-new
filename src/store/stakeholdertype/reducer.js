import {
  GET_STAKEHOLDER_TYPE_FAIL,
  GET_STAKEHOLDER_TYPE_SUCCESS,
  ADD_STAKEHOLDER_TYPE_SUCCESS,
  ADD_STAKEHOLDER_TYPE_FAIL,
  UPDATE_STAKEHOLDER_TYPE_SUCCESS,
  UPDATE_STAKEHOLDER_TYPE_FAIL,
  DELETE_STAKEHOLDER_TYPE_SUCCESS,
  DELETE_STAKEHOLDER_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  stakeholderType: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const StakeholderTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STAKEHOLDER_TYPE_SUCCESS:
      return {
        ...state,
        stakeholderType: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_STAKEHOLDER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_STAKEHOLDER_TYPE_SUCCESS:
      return {
        ...state,
        stakeholderType: {
          ...state.stakeholderType,
          data: [action.payload, ...state.stakeholderType.data],
        },
      };

    case ADD_STAKEHOLDER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STAKEHOLDER_TYPE_SUCCESS:
      return {
        ...state,
        stakeholderType: {
          ...state.stakeholderType,
          data: state.stakeholderType.data.map((STAKEHOLDER_TYPE) =>
            STAKEHOLDER_TYPE.sht_id.toString() === action.payload.sht_id.toString()
              ? { ...STAKEHOLDER_TYPE, ...action.payload } // Update the specific STAKEHOLDER_TYPE
              : STAKEHOLDER_TYPE
          ),
        },
      };

    case UPDATE_STAKEHOLDER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STAKEHOLDER_TYPE_SUCCESS:
      return {
        ...state,
        stakeholderType: {
          ...state.stakeholderType,
          data: state.stakeholderType.data.filter(
            (STAKEHOLDER_TYPE) =>
              STAKEHOLDER_TYPE.sht_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_STAKEHOLDER_TYPE_FAIL:
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

export default StakeholderTypeReducer;
