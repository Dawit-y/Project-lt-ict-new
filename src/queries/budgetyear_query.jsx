import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	populateBudgetYear,
	getBudgetYear,
	updateBudgetYear,
	addBudgetYear,
	deleteBudgetYear,
} from "../helpers/budgetyear_backend_helper";

const BUDGET_YEAR_QUERY_KEY = ["budgetyear"];

// Fetch budget_year
export const useFetchBudgetYears = () => {
	return useQuery({
		queryKey: BUDGET_YEAR_QUERY_KEY,
		queryFn: () => getBudgetYear(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search budget_year
export const useSearchBudgetYears = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_YEAR_QUERY_KEY, searchParams],
		queryFn: () => getBudgetYear(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

//for populating dropdown
export const usePopulateBudgetYears = (searchParams = {}) => {
	return useQuery({
		queryKey: [...BUDGET_YEAR_QUERY_KEY, searchParams],
		queryFn: () => populateBudgetYear(searchParams),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};
// Add budget_year
export const useAddBudgetYear = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addBudgetYear,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, bdy_id: tempId };

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
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdy_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});
		},
	});
};

// Update budget_year
export const useUpdateBudgetYear = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBudgetYear,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdy_id === updatedData.bdy_id ? { ...d, ...updatedData } : d
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
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.bdy_id === serverData.bdy_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});
		},
	});
};

// Delete budget_year
export const useDeleteBudgetYear = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudgetYear,

		onMutate: async (id) => {
			await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.bdy_id !== parseInt(id)),
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
				queryKey: BUDGET_YEAR_QUERY_KEY,
			});
		},
	});
};
