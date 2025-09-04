import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetExSource,
	updateBudgetExSource,
	addBudgetExSource,
	deleteBudgetExSource,
} from "../helpers/budgetexsource_backend_helper";

const BUDGET_EX_SOURCE_QUERY_KEY = ["budgetexsource"];

// Fetch budget_ex_source
export const useFetchBudgetExSources = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...BUDGET_EX_SOURCE_QUERY_KEY, "fetch", param],
		queryFn: () => getBudgetExSource(param),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};

//search budget_ex_source
export const useSearchBudgetExSources = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_EX_SOURCE_QUERY_KEY, searchParams],
		queryFn: () => getBudgetExSource(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add budget_ex_source
export const useAddBudgetExSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetExSource,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bes_id: tempId };

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
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bes_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});
		},
	});
};

// Update budget_ex_source
export const useUpdateBudgetExSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetExSource,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bes_id === updatedData.bes_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bes_id === serverData.bes_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});
		},
	});
};

// Delete budget_ex_source
export const useDeleteBudgetExSource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetExSource,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bes_id !== parseInt(id)),
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
				queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
			});
		},
	});
};
