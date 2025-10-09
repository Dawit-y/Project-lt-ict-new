import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getExpenditureCode,
	updateExpenditureCode,
	addExpenditureCode,
	deleteExpenditureCode,
} from "../helpers/expenditurecode_backend_helper";

const EXPENDITURE_CODE_QUERY_KEY = ["expenditurecode"];

// Fetch expenditure_code
export const useFetchExpenditureCodes = () => {
	return useQuery({
		queryKey: EXPENDITURE_CODE_QUERY_KEY,
		queryFn: () => getExpenditureCode(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search expenditure_code
export const useSearchExpenditureCodes = (searchParams = {}) => {
	return useQuery({
		queryKey: [...EXPENDITURE_CODE_QUERY_KEY, searchParams],
		queryFn: () => getExpenditureCode(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add expenditure_code
export const useAddExpenditureCode = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addExpenditureCode,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(EXPENDITURE_CODE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pec_id: tempId };

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
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pec_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});
		},
	});
};

// Update expenditure_code
export const useUpdateExpenditureCode = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateExpenditureCode,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(EXPENDITURE_CODE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pec_id === updatedData.pec_id ? { ...d, ...updatedData } : d
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
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pec_id === serverData.pec_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});
		},
	});
};

// Delete expenditure_code
export const useDeleteExpenditureCode = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteExpenditureCode,

		onMutate: async (id) => {
			await queryClient.cancelQueries(EXPENDITURE_CODE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pec_id !== parseInt(id)),
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
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});
		},
	});
};
