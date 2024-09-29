import {
  GET_PROJECT_STAKEHOLDER_FAIL,
  GET_PROJECT_STAKEHOLDER_SUCCESS,
  ADD_PROJECT_STAKEHOLDER_SUCCESS,
  ADD_PROJECT_STAKEHOLDER_FAIL,
  UPDATE_PROJECT_STAKEHOLDER_SUCCESS,
  UPDATE_PROJECT_STAKEHOLDER_FAIL,
  DELETE_PROJECT_STAKEHOLDER_SUCCESS,
  DELETE_PROJECT_STAKEHOLDER_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectStakeholder: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectStakeholderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_STAKEHOLDER_SUCCESS:
      return {
        ...state,
        projectStakeholder: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_STAKEHOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_STAKEHOLDER_SUCCESS:
      return {
        ...state,
        projectStakeholder: {
          ...state.projectStakeholder,
          data: [action.payload, ...state.projectStakeholder.data],
        },
      };

    case ADD_PROJECT_STAKEHOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_STAKEHOLDER_SUCCESS:
      return {
        ...state,
        projectStakeholder: {
          ...state.projectStakeholder,
          data: state.projectStakeholder.data.map((PROJECT_STAKEHOLDER) =>
            PROJECT_STAKEHOLDER.psh_id.toString() === action.payload.psh_id.toString()
              ? { ...PROJECT_STAKEHOLDER, ...action.payload } // Update the specific PROJECT_STAKEHOLDER
              : PROJECT_STAKEHOLDER
          ),
        },
      };

    case UPDATE_PROJECT_STAKEHOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_STAKEHOLDER_SUCCESS:
      return {
        ...state,
        projectStakeholder: {
          ...state.projectStakeholder,
          data: state.projectStakeholder.data.filter(
            (PROJECT_STAKEHOLDER) =>
              PROJECT_STAKEHOLDER.psh_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_STAKEHOLDER_FAIL:
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

export default ProjectStakeholderReducer;
