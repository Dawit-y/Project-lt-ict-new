import {
  GET_SECTOR_CATEGORY_FAIL,
  GET_SECTOR_CATEGORY_SUCCESS,
  ADD_SECTOR_CATEGORY_SUCCESS,
  ADD_SECTOR_CATEGORY_FAIL,
  UPDATE_SECTOR_CATEGORY_SUCCESS,
  UPDATE_SECTOR_CATEGORY_FAIL,
  DELETE_SECTOR_CATEGORY_SUCCESS,
  DELETE_SECTOR_CATEGORY_FAIL,
  TOGGLE_UPDATE_LOADING,
} from "./actionTypes";

const INIT_STATE = {
  update_loading: false,
  sectorCategory: {
    data: [],
    previledge: {},
  },
  error: {},
  loading: true,
};

const SectorCategoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SECTOR_CATEGORY_SUCCESS:
      return {
        ...state,
        sectorCategory: {
          data: action.payload.data,
          previledge: action.payload.previledge,
        },
        loading: false,
      };

    case GET_SECTOR_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_SECTOR_CATEGORY_SUCCESS:
      return {
        ...state,
        sectorCategory: {
          ...state.sectorCategory,
          data: [action.payload, ...state.sectorCategory.data],
        },
      };

    case ADD_SECTOR_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SECTOR_CATEGORY_SUCCESS:
      return {
        ...state,
        sectorCategory: {
          ...state.sectorCategory,
          data: state.sectorCategory.data.map((SECTOR_CATEGORY) =>
            SECTOR_CATEGORY.psc_delete_time.toString() === action.payload.psc_delete_time.toString()
              ? { ...SECTOR_CATEGORY, ...action.payload } // Update the specific SECTOR_CATEGORY
              : SECTOR_CATEGORY
          ),
        },
      };

    case UPDATE_SECTOR_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_SECTOR_CATEGORY_SUCCESS:
      return {
        ...state,
        sectorCategory: {
          ...state.sectorCategory,
          data: state.sectorCategory.data.filter(
            (SECTOR_CATEGORY) =>
              SECTOR_CATEGORY.psc_delete_time.toString() !== action.payload.deleted_id.toString()
          ),
        },
      };

    case DELETE_SECTOR_CATEGORY_FAIL:
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

export default SectorCategoryReducer;
