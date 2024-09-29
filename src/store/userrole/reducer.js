import {
  GET_USER_ROLE_FAIL,
  GET_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_FAIL,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
  DELETE_USER_ROLE_SUCCESS,
  DELETE_USER_ROLE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  userRole: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const UserRoleReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_ROLE_SUCCESS:
      return {
        ...state,
        userRole: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_USER_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_USER_ROLE_SUCCESS:
      return {
        ...state,
        userRole: {
          ...state.userRole,
          data: [action.payload, ...state.userRole.data],
        },
      };

    case ADD_USER_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        userRole: {
          ...state.userRole,
          data: state.userRole.data.map((USER_ROLE) =>
            USER_ROLE.url_id.toString() === action.payload.url_id.toString()
              ? { ...USER_ROLE, ...action.payload } // Update the specific USER_ROLE
              : USER_ROLE
          ),
        },
      };

    case UPDATE_USER_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_USER_ROLE_SUCCESS:
      return {
        ...state,
        userRole: {
          ...state.userRole,
          data: state.userRole.data.filter(
            (USER_ROLE) =>
              USER_ROLE.url_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_USER_ROLE_FAIL:
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

export default UserRoleReducer;
