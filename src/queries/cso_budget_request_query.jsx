import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetRequest,
	fetchBudgetRequest,
	addBudgetRequest,
	updateBudgetRequest,
	deleteBudgetRequest,
	getBudgetRequestforApproval,
	updateBudgetRequestApproval,
} from "../helpers/cso_budget_request_helper";

const CSO_BUDGET_REQUESTS_QUERY_KEY = ["csobudgetrequest"];

// Fetch budget_year
export const useFetchBudgetRequests = (params = {}) => {
	return useQuery({
		queryKey: [...CSO_BUDGET_REQUESTS_QUERY_KEY, params],
		queryFn: () => getBudgetRequest(params),
		staleTime: 1000 * 60 * 5,
		gcTime: 100 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

export const useFetchBudgetRequest = (id, userId, isActive = false) => {
	return useQuery({
		queryKey: [...CSO_BUDGET_REQUESTS_QUERY_KEY, "detail", id, userId],
		queryFn: () => fetchBudgetRequest(id),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: !!id && !!userId && isActive,
	});
};

//search budget_year
export const useSearchBudgetRequests = (searchParams = {}, isActive) => {
	return useQuery({
		queryKey: [...CSO_BUDGET_REQUESTS_QUERY_KEY, searchParams],
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
		queryKey: [...CSO_BUDGET_REQUESTS_QUERY_KEY, searchParams],
		queryFn: () => getBudgetRequestforApproval(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

export const useUpdateBudgetRequestApproval = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateBudgetRequestApproval,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_BUDGET_REQUESTS_QUERY_KEY,
				exact: false,
				refetchType: "all",
			});
		},
	});
};

export const useAddBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_BUDGET_REQUESTS_QUERY_KEY,
				exact: false,
				refetchType: "all",
			});
		},
	});
};

export const useUpdateBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_BUDGET_REQUESTS_QUERY_KEY,
				exact: false,
				refetchType: "all",
			});
		},
	});
};

export const useDeleteBudgetRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetRequest,
		onMutate: async (id) => {
			await queryClient.cancelQueries(CSO_BUDGET_REQUESTS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_BUDGET_REQUESTS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bdr_id !== parseInt(id)),
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
				queryKey: CSO_BUDGET_REQUESTS_QUERY_KEY,
			});
		},
	});
};
