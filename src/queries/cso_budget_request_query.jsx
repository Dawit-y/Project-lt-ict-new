import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetRequest,
	addBudgetRequest,
	updateBudgetRequest,
	deleteBudgetRequest,
	getBudgetRequestforApproval,
	updateBudgetRequestApproval,
} from "../helpers/cso_budget_request_helper";

const BUDGET_REQUESTS_QUERY_KEY = ["csobudgetrequest"];

// Fetch budget_year
export const useFetchBudgetRequests = (params = {}) => {
	return useQuery({
		queryKey: [...BUDGET_REQUESTS_QUERY_KEY, params],
		queryFn: () => getBudgetRequest(params),
		staleTime: 1000 * 60 * 5,
		gcTime: 100 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search budget_year
export const useSearchBudgetRequests = (searchParams = {}, isActive) => {
	return useQuery({
		queryKey: [...BUDGET_REQUESTS_QUERY_KEY, searchParams],
		queryFn: () => {
			if (Object.keys(searchParams).length === 0) {
				return Promise.resolve([]);
			}
			return getBudgetRequest(searchParams);
		},
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};
export const useSearchBudgetRequestforApproval = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_REQUESTS_QUERY_KEY, searchParams],
		queryFn: () => getBudgetRequestforApproval(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
export const useUpdateBudgetRequestApproval = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetRequestApproval,
		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdr_id === updatedData.bdr_id ? { ...d, ...updatedData } : d
						),
					};
				});
				return [queryKey, oldData];
			});

			return { previousData };
		},
		onError: (_err, _updatedData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},
		onSuccess: (updatedBudgetRequest, variables) => {
			const allQueries = queryClient
				.getQueriesData({
					queryKey: BUDGET_REQUESTS_QUERY_KEY,
				})
				.map(([key, data]) => ({
					key,
					data,
				}));

			allQueries.forEach(({ key }) => {
				queryClient.setQueryData(key, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((BudgetRequestData) =>
							BudgetRequestData.bdr_id === updatedBudgetRequest.data.bdr_id
								? { ...BudgetRequestData, ...updatedBudgetRequest.data }
								: BudgetRequestData
						),
					};
				});
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});
		},
	});
};

export const useAddBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetRequest,
		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: [
							{
								...newData,
								tempId: Date.now(),
							},
							...oldData.data,
						],
					};
				});
				return [queryKey, oldData];
			});
			return {
				previousData,
			};
		},
		onError: (_err, _newData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});
		},
	});
};

export const useUpdateBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetRequest,
		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdr_id === updatedData.bdr_id ? { ...d, ...updatedData } : d
						),
					};
				});
				return [queryKey, oldData];
			});

			return {
				previousData,
			};
		},
		onError: (_err, _updatedData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},
		onSuccess: (updatedBudgetRequest, variables) => {
			const allQueries = queryClient
				.getQueriesData({
					queryKey: BUDGET_REQUESTS_QUERY_KEY,
				})
				.map(([key, data]) => ({
					key,
					data,
				}));

			allQueries.forEach(({ key }) => {
				queryClient.setQueryData(key, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((BudgetRequestData) =>
							BudgetRequestData.bdr_id === updatedBudgetRequest.data.bdr_id
								? { ...BudgetRequestData, ...updatedBudgetRequest.data }
								: BudgetRequestData
						),
					};
				});
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});
		},
	});
};

export const useDeleteBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetRequest,
		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bdr_id !== parseInt(id)),
					};
				});
				return [queryKey, oldData];
			});

			return {
				previousData,
			};
		},
		onError: (_err, _id, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},
		onSuccess: (deletedData) => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUESTS_QUERY_KEY,
			});
		},
	});
};
