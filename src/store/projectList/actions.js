import {
	PROJECT_LIST_SET_TREE_STATE,
	PROJECT_LIST_SET_SEARCH_STATE,
	PROJECT_LIST_SET_PAGINATION_STATE,
	PROJECT_LIST_SET_UI_STATE,
	PROJECT_LIST_CLEAR_TREE_SELECTION,
	PROJECT_LIST_RESET_STATE,
} from "./actionTypes";

export const setProjectListTreeState = (treeState) => ({
	type: PROJECT_LIST_SET_TREE_STATE,
	payload: treeState,
});

export const setProjectListSearchState = (searchState) => ({
	type: PROJECT_LIST_SET_SEARCH_STATE,
	payload: searchState,
});

export const setProjectListPaginationState = (paginationState) => ({
	type: PROJECT_LIST_SET_PAGINATION_STATE,
	payload: paginationState,
});

export const setProjectListUIState = (uiState) => ({
	type: PROJECT_LIST_SET_UI_STATE,
	payload: uiState,
});

export const clearProjectListTreeSelection = () => ({
	type: PROJECT_LIST_CLEAR_TREE_SELECTION,
});

export const resetProjectListState = () => ({
	type: PROJECT_LIST_RESET_STATE,
});
