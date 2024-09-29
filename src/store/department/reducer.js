import {
  GET_DEPARTMENT_FAIL,
  GET_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FAIL,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FAIL,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  department: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const DepartmentReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: {
          ...state.department,
          data: [action.payload, ...state.department.data],
        },
      };

    case ADD_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: {
          ...state.department,
          data: state.department.data.map((DEPARTMENT) =>
            DEPARTMENT.dep_id.toString() === action.payload.dep_id.toString()
              ? { ...DEPARTMENT, ...action.payload } // Update the specific DEPARTMENT
              : DEPARTMENT
          ),
        },
      };

    case UPDATE_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: {
          ...state.department,
          data: state.department.data.filter(
            (DEPARTMENT) =>
              DEPARTMENT.dep_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_DEPARTMENT_FAIL:
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

export default DepartmentReducer;
