import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPaymentCategory,
	updatePaymentCategory,
	addPaymentCategory,
	deletePaymentCategory,
} from "../helpers/paymentcategory_backend_helper";

const PAYMENT_CATEGORY_QUERY_KEY = ["paymentcategory"];

// Fetch payment_category
export const useFetchPaymentCategorys = () => {
	return useQuery({
		queryKey: PAYMENT_CATEGORY_QUERY_KEY,
		queryFn: () => getPaymentCategory(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};
//search payment_category
export const useSearchPaymentCategorys = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PAYMENT_CATEGORY_QUERY_KEY, searchParams],
		queryFn: () => getPaymentCategory(searchParams),
		staleTime: 1000 * 60 * 2,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

// Add payment_category
export const useAddPaymentCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addPaymentCategory,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PAYMENT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});
		},
	});
};

// Update payment_category
export const useUpdatePaymentCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePaymentCategory,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PAYMENT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pyc_id === updatedData.data.pyc_id
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pyc_id === updatedData.data.pyc_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});
		},
	});
};

// Delete payment_category
export const useDeletePaymentCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePaymentCategory,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PAYMENT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pyc_id !== parseInt(id)),
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pyc_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});
		},
	});
};
