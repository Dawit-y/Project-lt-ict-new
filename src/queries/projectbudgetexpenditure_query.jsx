import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectBudgetExpenditure,
	updateProjectBudgetExpenditure,
	addProjectBudgetExpenditure,
	deleteProjectBudgetExpenditure,
} from "../helpers/projectbudgetexpenditure_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_BUDGET_EXPENDITURE_QUERY_KEY = ["projectbudgetexpenditure"];

// Fetch project_budget_expenditure
export const useFetchProjectBudgetExpenditures = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectBudgetExpenditure(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_budget_expenditure
export const useSearchProjectBudgetExpenditures = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectBudgetExpenditure(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};
export const useAddProjectBudgetExpenditure = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectBudgetExpenditure,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pbe_id: tempId };

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: [optimisticData, ...oldData.data],
					};
				});
			});

			return { previousQueries, tempId };
		},

		onError: (_err, _newData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (response, _newData, context) => {
			const serverData = response.data;

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbe_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_budget_expenditure
export const useUpdateProjectBudgetExpenditure = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectBudgetExpenditure,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbe_id === updatedData.pbe_id ? { ...d, ...updatedData } : d
						),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _updatedData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (response) => {
			const serverData = response.data;

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbe_id === serverData.pbe_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_budget_expenditure
export const useDeleteProjectBudgetExpenditure = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectBudgetExpenditure,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((dept) => dept.pbe_id !== parseInt(id)),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _id, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
