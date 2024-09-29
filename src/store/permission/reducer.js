import {
  GET_PERMISSION_FAIL,
  GET_PERMISSION_SUCCESS,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAIL,
  UPDATE_PERMISSION_SUCCESS,
  UPDATE_PERMISSION_FAIL,
  DELETE_PERMISSION_SUCCESS,
  DELETE_PERMISSION_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  permission: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const PermissionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PERMISSION_SUCCESS:
      return {
        ...state,
        permission: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PERMISSION_SUCCESS:
      return {
        ...state,
        permission: {
          ...state.permission,
          data: [action.payload, ...state.permission.data],
        },
      };

    case ADD_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PERMISSION_SUCCESS:
      return {
        ...state,
        permission: {
          ...state.permission,
          data: state.permission.data.map((PERMISSION) =>
            PERMISSION.pem_id === action.payload.pem_id
              ? { ...PERMISSION, ...action.payload } // Update the specific PERMISSION
              : PERMISSION
          ),
        },
      };

    case UPDATE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PERMISSION_SUCCESS:
      return {
        ...state,
        permission: {
          ...state.permission,
          data: state.permission.data.filter(
            (PERMISSION) =>
              PERMISSION.pem_id !== action.payload.deleted_id
          ),
        },
      };

    case DELETE_PERMISSION_FAIL:
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

export default PermissionReducer;
