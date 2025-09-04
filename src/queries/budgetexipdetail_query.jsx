import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBudgetExipDetail,
	updateBudgetExipDetail,
	addBudgetExipDetail,
	deleteBudgetExipDetail,
} from "../helpers/budgetexipdetail_backend_helper";

const BUDGET_EXIP_DETAIL_QUERY_KEY = ["budgetexipdetail"];
// Fetch budget_exip_detail
export const useFetchBudgetExipDetails = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...BUDGET_EXIP_DETAIL_QUERY_KEY, "fetch", param],
		queryFn: () => getBudgetExipDetail(param),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search budget_exip_detail
export const useSearchBudgetExipDetails = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_EXIP_DETAIL_QUERY_KEY, searchParams],
		queryFn: () => getBudgetExipDetail(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add budget_exip_detail
export const useAddBudgetExipDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetExipDetail,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bed_id: tempId };

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
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bed_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});
		},
	});
};

// Update budget_exip_detail
export const useUpdateBudgetExipDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetExipDetail,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bed_id === updatedData.bed_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bed_id === serverData.bed_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});
		},
	});
};

// Delete budget_exip_detail
export const useDeleteBudgetExipDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetExipDetail,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bed_id !== parseInt(id)),
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
				queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
			});
		},
	});
};
