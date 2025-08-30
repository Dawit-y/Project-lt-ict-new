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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: [newData, ...oldData.data],
					};
				});
				return [queryKey, oldData];
			});

			return { previousData };
		},

		onError: (_err, _newData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (newDataResponse) => {
			const newData = {
				...newDataResponse.data,
				...newDataResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.tempId === newData.tempId ? newData : d
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pec_id === updatedData.data.pec_id
								? { ...d, ...updatedData.data }
								: d
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

		onSuccess: (updatedData) => {
			const queries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pec_id === updatedData.data.pec_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pec_id !== parseInt(id)),
					};
				});
				return [queryKey, oldData];
			});

			return { previousData };
		},

		onError: (_err, _id, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: EXPENDITURE_CODE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pec_id !== parseInt(variable)),
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
