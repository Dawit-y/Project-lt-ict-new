import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetRequestAmount,
	updateBudgetRequestAmount,
	addBudgetRequestAmount,
	deleteBudgetRequestAmount,
} from "../helpers/budgetrequestamount_backend_helper";

const BUDGET_REQUEST_AMOUNT_QUERY_KEY = ["budgetrequestamount"];

// Fetch budget_request_amount
export const useFetchBudgetRequestAmounts = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...BUDGET_REQUEST_AMOUNT_QUERY_KEY, "fetch", param],
		queryFn: () => getBudgetRequestAmount(param),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		meta: { persist: false },
		refetchOnWindowFocus: true,
		refetchOnMount: false,
		enabled: isActive,
	});
};

//search budget_request_amount
export const useSearchBudgetRequestAmounts = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_REQUEST_AMOUNT_QUERY_KEY, searchParams],
		queryFn: () => getBudgetRequestAmount(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add budget_request_amount
export const useAddBudgetRequestAmount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetRequestAmount,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bra_id: tempId };

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
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bra_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});
		},
	});
};

// Update budget_request_amount
export const useUpdateBudgetRequestAmount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetRequestAmount,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bra_id === updatedData.bra_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bra_id === serverData.bra_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});
		},
	});
};

// Delete budget_request_amount
export const useDeleteBudgetRequestAmount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetRequestAmount,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bra_id !== parseInt(id)),
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
				queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
			});
		},
	});
};
