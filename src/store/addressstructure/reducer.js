import {
  GET_ADDRESS_STRUCTURE_FAIL,
  GET_ADDRESS_STRUCTURE_SUCCESS,
  ADD_ADDRESS_STRUCTURE_SUCCESS,
  ADD_ADDRESS_STRUCTURE_FAIL,
  UPDATE_ADDRESS_STRUCTURE_SUCCESS,
  UPDATE_ADDRESS_STRUCTURE_FAIL,
  DELETE_ADDRESS_STRUCTURE_SUCCESS,
  DELETE_ADDRESS_STRUCTURE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  addressStructure: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const AddressStructureReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADDRESS_STRUCTURE_SUCCESS:
      return {
        ...state,
        addressStructure: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_ADDRESS_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_ADDRESS_STRUCTURE_SUCCESS:
      return {
        ...state,
        addressStructure: {
          ...state.addressStructure,
          data: [action.payload, ...state.addressStructure.data],
        },
      };

    case ADD_ADDRESS_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ADDRESS_STRUCTURE_SUCCESS:
      return {
        ...state,
        addressStructure: {
          ...state.addressStructure,
          data: state.addressStructure.data.map((ADDRESS_STRUCTURE) =>
            ADDRESS_STRUCTURE.add_id.toString() === action.payload.add_id.toString()
              ? { ...ADDRESS_STRUCTURE, ...action.payload } // Update the specific ADDRESS_STRUCTURE
              : ADDRESS_STRUCTURE
          ),
        },
      };

    case UPDATE_ADDRESS_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ADDRESS_STRUCTURE_SUCCESS:
      return {
        ...state,
        addressStructure: {
          ...state.addressStructure,
          data: state.addressStructure.data.filter(
            (ADDRESS_STRUCTURE) =>
              ADDRESS_STRUCTURE.add_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_ADDRESS_STRUCTURE_FAIL:
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

export default AddressStructureReducer;
