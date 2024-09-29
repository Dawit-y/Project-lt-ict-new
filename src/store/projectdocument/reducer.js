import {
  GET_PROJECT_DOCUMENT_FAIL,
  GET_PROJECT_DOCUMENT_SUCCESS,
  ADD_PROJECT_DOCUMENT_SUCCESS,
  ADD_PROJECT_DOCUMENT_FAIL,
  UPDATE_PROJECT_DOCUMENT_SUCCESS,
  UPDATE_PROJECT_DOCUMENT_FAIL,
  DELETE_PROJECT_DOCUMENT_SUCCESS,
  DELETE_PROJECT_DOCUMENT_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  projectDocument: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const ProjectDocumentReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_DOCUMENT_SUCCESS:
      return {
        ...state,
        projectDocument: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_PROJECT_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PROJECT_DOCUMENT_SUCCESS:
      return {
        ...state,
        projectDocument: {
          ...state.projectDocument,
          data: [action.payload, ...state.projectDocument.data],
        },
      };

    case ADD_PROJECT_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROJECT_DOCUMENT_SUCCESS:
      return {
        ...state,
        projectDocument: {
          ...state.projectDocument,
          data: state.projectDocument.data.map((PROJECT_DOCUMENT) =>
            PROJECT_DOCUMENT.prd_id.toString() === action.payload.prd_id.toString()
              ? { ...PROJECT_DOCUMENT, ...action.payload } // Update the specific PROJECT_DOCUMENT
              : PROJECT_DOCUMENT
          ),
        },
      };

    case UPDATE_PROJECT_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROJECT_DOCUMENT_SUCCESS:
      return {
        ...state,
        projectDocument: {
          ...state.projectDocument,
          data: state.projectDocument.data.filter(
            (PROJECT_DOCUMENT) =>
              PROJECT_DOCUMENT.prd_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_PROJECT_DOCUMENT_FAIL:
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

export default ProjectDocumentReducer;
