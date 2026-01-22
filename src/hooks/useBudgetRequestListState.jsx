import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
	setListTreeState,
	setListSearchState,
	setListPaginationState,
	setListUIState,
	clearListTreeSelection,
	resetListState,
} from "../store/projectList/actions";

export const useBudgetRequestListState = () => {
	const dispatch = useDispatch();
	const budgetRequestListState = useSelector(
		(state) => state.budgetRequestList,
	);
	const namespace = "budgetRequestList";

	const setTreeState = useCallback(
		(treeState) => {
			dispatch(setListTreeState(namespace, treeState));
		},
		[dispatch, namespace],
	);

	const setSearchState = useCallback(
		(searchState) => {
			dispatch(setListSearchState(namespace, searchState));
		},
		[dispatch, namespace],
	);

	const setPaginationState = useCallback(
		(paginationState) => {
			dispatch(setListPaginationState(namespace, paginationState));
		},
		[dispatch, namespace],
	);

	const setUIState = useCallback(
		(uiState) => {
			dispatch(setListUIState(namespace, uiState));
		},
		[dispatch, namespace],
	);

	const clearTreeSelection = useCallback(() => {
		dispatch(clearListTreeSelection(namespace));
	}, [dispatch, namespace]);

	const resetBudgetRequestListState = useCallback(() => {
		dispatch(resetListState(namespace));
	}, [dispatch, namespace]);

	return {
		budgetRequestListState,
		setTreeState,
		setSearchState,
		setPaginationState,
		setUIState,
		clearTreeSelection,
		resetBudgetRequestListState,
	};
};
