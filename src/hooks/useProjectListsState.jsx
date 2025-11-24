import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
	setProjectListTreeState,
	setProjectListSearchState,
	setProjectListPaginationState,
	setProjectListUIState,
	clearProjectListTreeSelection,
	resetProjectListState,
} from "../store/projectList/actions";

export const useProjectListState = () => {
	const dispatch = useDispatch();
	const projectListState = useSelector((state) => state.projectList);

	const setTreeState = useCallback(
		(treeState) => {
			dispatch(setProjectListTreeState(treeState));
		},
		[dispatch]
	);

	const setSearchState = useCallback(
		(searchState) => {
			dispatch(setProjectListSearchState(searchState));
		},
		[dispatch]
	);

	const setPaginationState = useCallback(
		(paginationState) => {
			dispatch(setProjectListPaginationState(paginationState));
		},
		[dispatch]
	);

	const setUIState = useCallback(
		(uiState) => {
			dispatch(setProjectListUIState(uiState));
		},
		[dispatch]
	);

	const clearTreeSelection = useCallback(() => {
		dispatch(clearProjectListTreeSelection());
	}, [dispatch]);

	const resetProjectListState = useCallback(() => {
		dispatch(resetProjectListState());
	}, [dispatch]);

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
