import {
	PROJECT_LIST_SET_TREE_STATE,
	PROJECT_LIST_SET_SEARCH_STATE,
	PROJECT_LIST_SET_PAGINATION_STATE,
	PROJECT_LIST_SET_UI_STATE,
	PROJECT_LIST_CLEAR_TREE_SELECTION,
	PROJECT_LIST_RESET_STATE,
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

const projectListReducer = (state = initialState, action) => {
	switch (action.type) {
		case PROJECT_LIST_SET_TREE_STATE:
			return {
				...state,
				...action.payload,
			};

		case PROJECT_LIST_SET_SEARCH_STATE:
			return {
				...state,
				...action.payload,
			};

		case PROJECT_LIST_SET_PAGINATION_STATE:
			return {
				...state,
				pagination: {
					...state.pagination,
					...action.payload,
				},
			};

		case PROJECT_LIST_SET_UI_STATE:
			return {
				...state,
				...action.payload,
			};

		case PROJECT_LIST_CLEAR_TREE_SELECTION:
			return {
				...state,
				prjLocationRegionId: null,
				prjLocationZoneId: null,
				prjLocationWoredaId: null,
			};

		case PROJECT_LIST_RESET_STATE:
			return {
				...initialState,
			};

		default:
			return state;
	}
};

export default projectListReducer;
