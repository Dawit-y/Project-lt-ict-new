import {
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
  ADD_USERS_SUCCESS,
  ADD_USERS_FAIL,
  UPDATE_USERS_SUCCESS,
  UPDATE_USERS_FAIL,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  users: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const UsersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          data: [action.payload, ...state.users.data],
        },
      };

    case ADD_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          data: state.users.data.map((USERS) =>
            USERS.usr_id.toString() === action.payload.usr_id.toString()
              ? { ...USERS, ...action.payload } // Update the specific USERS
              : USERS
          ),
        },
      };

    case UPDATE_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          data: state.users.data.filter(
            (USERS) =>
              USERS.usr_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_USERS_FAIL:
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

export default UsersReducer;
