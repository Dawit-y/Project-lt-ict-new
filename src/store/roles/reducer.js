import {
  GET_ROLES_FAIL,
  GET_ROLES_SUCCESS,
  ADD_ROLES_SUCCESS,
  ADD_ROLES_FAIL,
  UPDATE_ROLES_SUCCESS,
  UPDATE_ROLES_FAIL,
  DELETE_ROLES_SUCCESS,
  DELETE_ROLES_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  roles: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const RolesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ROLES_SUCCESS:
      return {
        ...state,
        roles: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_ROLES_SUCCESS:
      return {
        ...state,
        roles: {
          ...state.roles,
          data: [action.payload, ...state.roles.data],
        },
      };

    case ADD_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ROLES_SUCCESS:
      return {
        ...state,
        roles: {
          ...state.roles,
          data: state.roles.data.map((ROLES) =>
            ROLES.rol_id.toString() === action.payload.rol_id.toString()
              ? { ...ROLES, ...action.payload } // Update the specific ROLES
              : ROLES
          ),
        },
      };

    case UPDATE_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ROLES_SUCCESS:
      return {
        ...state,
        roles: {
          ...state.roles,
          data: state.roles.data.filter(
            (ROLES) =>
              ROLES.rol_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_ROLES_FAIL:
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

export default RolesReducer;
