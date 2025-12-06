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

export const useProjectListState = () => {
	const dispatch = useDispatch();
	const projectListState = useSelector((state) => state.projectList);
	const namespace = "projectList";

	const setTreeState = useCallback(
		(treeState) => {
			dispatch(setListTreeState(namespace, treeState));
		},
		[dispatch, namespace]
	);

	const setSearchState = useCallback(
		(searchState) => {
			dispatch(setListSearchState(namespace, searchState));
		},
		[dispatch, namespace]
	);

	const setPaginationState = useCallback(
		(paginationState) => {
			dispatch(setListPaginationState(namespace, paginationState));
		},
		[dispatch, namespace]
	);

	const setUIState = useCallback(
		(uiState) => {
			dispatch(setListUIState(namespace, uiState));
		},
		[dispatch, namespace]
	);

	const clearTreeSelection = useCallback(() => {
		dispatch(clearListTreeSelection(namespace));
	}, [dispatch, namespace]);

	const resetProjectListState = useCallback(() => {
		dispatch(resetListState(namespace));
	}, [dispatch, namespace]);

	return {
		projectListState,
		setTreeState,
		setSearchState,
		setPaginationState,
		setUIState,
		clearTreeSelection,
		resetProjectListState,
	};
};
