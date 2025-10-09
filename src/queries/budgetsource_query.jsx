import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetSource,
	updateBudgetSource,
	addBudgetSource,
	deleteBudgetSource,
} from "../helpers/budgetsource_backend_helper";

const BUDGET_SOURCE_QUERY_KEY = ["budgetsource"];

// Fetch budget_source
export const useFetchBudgetSources = () => {
	return useQuery({
		queryKey: BUDGET_SOURCE_QUERY_KEY,
		queryFn: () => getBudgetSource(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search budget_source
export const useSearchBudgetSources = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_SOURCE_QUERY_KEY, searchParams],
		queryFn: () => getBudgetSource(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add budget_source
export const useAddBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetSource,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pbs_id: tempId };

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
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbs_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});
		},
	});
};

// Update budget_source
export const useUpdateBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetSource,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbs_id === updatedData.pbs_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pbs_id === serverData.pbs_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});
		},
	});
};

// Delete budget_source
export const useDeleteBudgetSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetSource,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pbs_id !== parseInt(id)),
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
				queryKey: BUDGET_SOURCE_QUERY_KEY,
			});
		},
	});
};
