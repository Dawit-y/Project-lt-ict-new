import {
  LIST_SET_TREE_STATE,
  LIST_SET_SEARCH_STATE,
  LIST_SET_PAGINATION_STATE,
  LIST_SET_UI_STATE,
  LIST_CLEAR_TREE_SELECTION,
  LIST_RESET_STATE,
} from "./actionTypes";

const initialState = {
  // Tree state
  prjLocationRegionId: null,
  prjLocationZoneId: null,
  prjLocationWoredaId: null,
  include: 0,
  isCollapsed: false,
  nodeId: null,

  // Search state
  searchParams: {},
  projectParams: {},
  exportSearchParams: {},

  // Pagination state
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: null,
    totalPages: null,
    hasNext: false,
    hasPrev: false,
  },

  // UI state
  showSearchResult: false,
};


const citizenProjectListReducer = (state = initialState, action) => {
  if (action.meta?.namespace !== "citizenProjectList") {
		return state;
	}

  switch (action.type) {
    case LIST_SET_TREE_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case LIST_SET_SEARCH_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case LIST_SET_PAGINATION_STATE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case LIST_SET_UI_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case LIST_CLEAR_TREE_SELECTION:
      return {
        ...state,
        prjLocationRegionId: null,
        prjLocationZoneId: null,
        prjLocationWoredaId: null,
      };

    case LIST_RESET_STATE:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default citizenProjectListReducer;