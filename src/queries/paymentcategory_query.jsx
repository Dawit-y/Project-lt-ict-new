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

			const tempId = Date.now();
			const optimisticData = { ...newData, pyc_id: tempId };

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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pyc_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pyc_id === updatedData.pyc_id ? { ...d, ...updatedData } : d
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pyc_id === serverData.pyc_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pyc_id !== parseInt(id)),
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
				queryKey: PAYMENT_CATEGORY_QUERY_KEY,
			});
		},
	});
};
