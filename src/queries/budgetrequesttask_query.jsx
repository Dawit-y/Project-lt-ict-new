import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetRequestTask,
	updateBudgetRequestTask,
	addBudgetRequestTask,
	deleteBudgetRequestTask,
} from "../helpers/budgetrequesttask_backend_helper";

const BUDGET_REQUEST_TASK_QUERY_KEY = ["budgetrequesttask"];

// Fetch budget_request_task
export const useFetchBudgetRequestTasks = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...BUDGET_REQUEST_TASK_QUERY_KEY, "fetch", param],
		queryFn: () => getBudgetRequestTask(param),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};

//search budget_request_task
export const useSearchBudgetRequestTasks = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_REQUEST_TASK_QUERY_KEY, "search", searchParams],
		queryFn: () => getBudgetRequestTask(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add budget_request_task
export const useAddBudgetRequestTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetRequestTask,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, brt_id: tempId };

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
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.brt_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});
		},
	});
};

// Update budget_request_task
export const useUpdateBudgetRequestTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetRequestTask,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.brt_id === updatedData.brt_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.brt_id === serverData.brt_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});
		},
	});
};

// Delete budget_request_task
export const useDeleteBudgetRequestTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetRequestTask,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.brt_id !== parseInt(id)),
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
				queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
			});
		},
	});
};
