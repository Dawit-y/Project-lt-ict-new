import {
  GET_SECTOR_INFORMATION_FAIL,
  GET_SECTOR_INFORMATION_SUCCESS,
  ADD_SECTOR_INFORMATION_SUCCESS,
  ADD_SECTOR_INFORMATION_FAIL,
  UPDATE_SECTOR_INFORMATION_SUCCESS,
  UPDATE_SECTOR_INFORMATION_FAIL,
  DELETE_SECTOR_INFORMATION_SUCCESS,
  DELETE_SECTOR_INFORMATION_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  sectorInformation: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const SectorInformationReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SECTOR_INFORMATION_SUCCESS:
      return {
        ...state,
        sectorInformation: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_SECTOR_INFORMATION_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_SECTOR_INFORMATION_SUCCESS:
      return {
        ...state,
        sectorInformation: {
          ...state.sectorInformation,
          data: [action.payload, ...state.sectorInformation.data],
        },
      };

    case ADD_SECTOR_INFORMATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SECTOR_INFORMATION_SUCCESS:
      return {
        ...state,
        sectorInformation: {
          ...state.sectorInformation,
          data: state.sectorInformation.data.map((SECTOR_INFORMATION) =>
            SECTOR_INFORMATION.sci_id.toString() === action.payload.sci_id.toString()
              ? { ...SECTOR_INFORMATION, ...action.payload } // Update the specific SECTOR_INFORMATION
              : SECTOR_INFORMATION
          ),
        },
      };

    case UPDATE_SECTOR_INFORMATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_SECTOR_INFORMATION_SUCCESS:
      return {
        ...state,
        sectorInformation: {
          ...state.sectorInformation,
          data: state.sectorInformation.data.filter(
            (SECTOR_INFORMATION) =>
              SECTOR_INFORMATION.sci_id.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_SECTOR_INFORMATION_FAIL:
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

export default SectorInformationReducer;
