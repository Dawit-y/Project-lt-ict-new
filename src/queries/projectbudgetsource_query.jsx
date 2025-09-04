import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectBudgetSource,
	updateProjectBudgetSource,
	addProjectBudgetSource,
	deleteProjectBudgetSource,
} from "../helpers/projectbudgetsource_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_BUDGET_SOURCE_QUERY_KEY = ["projectbudgetsource"];

// Fetch project_budget_source
export const useFetchProjectBudgetSources = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectBudgetSource(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_budget_source
export const useSearchProjectBudgetSources = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectBudgetSource(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_budget_source
export const useAddProjectBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectBudgetSource,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bsr_id: tempId };

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
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bsr_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_budget_source
export const useUpdateProjectBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectBudgetSource,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bsr_id === updatedData.bsr_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bsr_id === serverData.bsr_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_budget_source
export const useDeleteProjectBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectBudgetSource,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bsr_id !== parseInt(id)),
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
				queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
