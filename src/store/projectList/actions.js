import {
	LIST_SET_TREE_STATE,
	LIST_SET_SEARCH_STATE,
	LIST_SET_PAGINATION_STATE,
	LIST_SET_UI_STATE,
	LIST_CLEAR_TREE_SELECTION,
	LIST_RESET_STATE,
} from "./actionTypes";

export const setListTreeState = (namespace, payload) => ({
	type: LIST_SET_TREE_STATE,
	payload,
	meta: { namespace },
});

export const setListSearchState = (namespace, payload) => ({
	type: LIST_SET_SEARCH_STATE,
	payload,
	meta: { namespace },
});

export const setListPaginationState = (namespace, payload) => ({
	type: LIST_SET_PAGINATION_STATE,
	payload,
	meta: { namespace },
});

export const setListUIState = (namespace, payload) => ({
	type: LIST_SET_UI_STATE,
	payload,
	meta: { namespace },
});

export const clearListTreeSelection = (namespace) => ({
	type: LIST_CLEAR_TREE_SELECTION,
	meta: { namespace },
});

export const resetListState = (namespace) => ({
	type: LIST_RESET_STATE,
	meta: { namespace },
});
