import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetMonth,
	updateBudgetMonth,
	addBudgetMonth,
	deleteBudgetMonth,
} from "../helpers/budgetmonth_backend_helper";

const BUDGET_MONTH_QUERY_KEY = ["budgetmonth"];

// Fetch budget_month
export const useFetchBudgetMonths = () => {
	return useQuery({
		queryKey: BUDGET_MONTH_QUERY_KEY,
		queryFn: () => getBudgetMonth(),
		staleTime: 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search budget_month
export const useSearchBudgetMonths = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_MONTH_QUERY_KEY, searchParams],
		queryFn: () => getBudgetMonth(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add budget_month
export const useAddBudgetMonth = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetMonth,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bdm_id: tempId };

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
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdm_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});
		},
	});
};

// Update budget_month
export const useUpdateBudgetMonth = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetMonth,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdm_id === updatedData.bdm_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdm_id === serverData.bdm_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});
		},
	});
};

// Delete budget_month
export const useDeleteBudgetMonth = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetMonth,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bdm_id !== parseInt(id)),
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
				queryKey: BUDGET_MONTH_QUERY_KEY,
			});
		},
	});
};
