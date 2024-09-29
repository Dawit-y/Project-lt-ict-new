import {
  GET_DOCUMENT_TYPE_FAIL,
  GET_DOCUMENT_TYPE_SUCCESS,
  ADD_DOCUMENT_TYPE_SUCCESS,
  ADD_DOCUMENT_TYPE_FAIL,
  UPDATE_DOCUMENT_TYPE_SUCCESS,
  UPDATE_DOCUMENT_TYPE_FAIL,
  DELETE_DOCUMENT_TYPE_SUCCESS,
  DELETE_DOCUMENT_TYPE_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  documentType: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const DocumentTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DOCUMENT_TYPE_SUCCESS:
      return {
        ...state,
        documentType: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_DOCUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_DOCUMENT_TYPE_SUCCESS:
      return {
        ...state,
        documentType: {
          ...state.documentType,
          data: [action.payload, ...state.documentType.data],
        },
      };

    case ADD_DOCUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DOCUMENT_TYPE_SUCCESS:
      return {
        ...state,
        documentType: {
          ...state.documentType,
          data: state.documentType.data.map((DOCUMENT_TYPE) =>
            DOCUMENT_TYPE.pdt_id.toString() === action.payload.pdt_id.toString()
              ? { ...DOCUMENT_TYPE, ...action.payload } // Update the specific DOCUMENT_TYPE
              : DOCUMENT_TYPE
          ),
        },
      };

    case UPDATE_DOCUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DOCUMENT_TYPE_SUCCESS:
      return {
        ...state,
        documentType: {
          ...state.documentType,
          data: state.documentType.data.filter(
            (DOCUMENT_TYPE) =>
              DOCUMENT_TYPE.pdt_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_DOCUMENT_TYPE_FAIL:
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

export default DocumentTypeReducer;
