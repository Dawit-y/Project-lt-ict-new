import {
	SET_PROJECT_LIST_STATE,
	RESET_PROJECT_LIST_STATE,
} from "./actionTypes";

const initialState = {
	searchResults: null,
	projectParams: {},
	params: {},
	searchParams: {},
	showSearchResult: false,
	prjLocationRegionId: null,
	prjLocationZoneId: null,
	prjLocationWoredaId: null,
	include: 0,
	isCollapsed: false,
	selectedNode: {},
	searchTerm: "",
};

const projectListReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PROJECT_LIST_STATE:
			return { ...state, ...action.payload };
		case RESET_PROJECT_LIST_STATE:
			return { ...initialState };
		default:
			return state;
	}
};

export default projectListReducer;
