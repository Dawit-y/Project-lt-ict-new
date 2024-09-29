import {
  GET_PROJECT_CONTRACTOR_FAIL,
  GET_PROJECT_CONTRACTOR_SUCCESS,
  ADD_PROJECT_CONTRACTOR_SUCCESS,
  ADD_PROJECT_CONTRACTOR_FAIL,
  UPDATE_PROJECT_CONTRACTOR_SUCCESS,
  UPDATE_PROJECT_CONTRACTOR_FAIL,
  DELETE_PROJECT_CONTRACTOR_SUCCESS,
  DELETE_PROJECT_CONTRACTOR_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectContractor: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectContractorReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_CONTRACTOR_SUCCESS:
      return {
        ...state,
        projectContractor: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_CONTRACTOR_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_CONTRACTOR_SUCCESS:
      return {
        ...state,
        projectContractor: {
          ...state.projectContractor,
          data: [action.payload, ...state.projectContractor.data],
        },
      };

    case ADD_PROJECT_CONTRACTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_CONTRACTOR_SUCCESS:
      return {
        ...state,
        projectContractor: {
          ...state.projectContractor,
          data: state.projectContractor.data.map((PROJECT_CONTRACTOR) =>
            PROJECT_CONTRACTOR.cni_id.toString() === action.payload.cni_id.toString()
              ? { ...PROJECT_CONTRACTOR, ...action.payload } // Update the specific PROJECT_CONTRACTOR
              : PROJECT_CONTRACTOR
          ),
        },
      };

    case UPDATE_PROJECT_CONTRACTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_CONTRACTOR_SUCCESS:
      return {
        ...state,
        projectContractor: {
          ...state.projectContractor,
          data: state.projectContractor.data.filter(
            (PROJECT_CONTRACTOR) =>
              PROJECT_CONTRACTOR.cni_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_CONTRACTOR_FAIL:
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

export default ProjectContractorReducer;
