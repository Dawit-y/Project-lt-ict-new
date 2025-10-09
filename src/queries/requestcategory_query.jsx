import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRequestCategory,
	updateRequestCategory,
	addRequestCategory,
	deleteRequestCategory,
} from "../helpers/requestcategory_backend_helper";

const REQUEST_CATEGORY_QUERY_KEY = ["requestcategory"];

// Fetch request_category
export const useFetchRequestCategorys = () => {
	return useQuery({
		queryKey: REQUEST_CATEGORY_QUERY_KEY,
		queryFn: () => getRequestCategory(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search request_category
export const useSearchRequestCategorys = (searchParams = {}) => {
	return useQuery({
		queryKey: [...REQUEST_CATEGORY_QUERY_KEY, searchParams],
		queryFn: () => getRequestCategory(searchParams),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

export const useAddRequestCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addRequestCategory,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(REQUEST_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Create a temporary ID for optimistic update
					const tempData = {
						...newData,
						tempId: Date.now(), // Add temporary ID for later matching
						rqc_id: `temp-${Date.now()}`, // Temporary ID since we don't have real ID yet
					};

					return {
						...oldData,
						data: [tempData, ...oldData.data], // Add to beginning of array
					};
				});

				return [queryKey, originalData];
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
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Replace temporary item with real data from server
					return {
						...oldData,
						data: oldData.data
							.map((item) => (item.tempId ? newData : item))
							.filter(
								(item, index, array) =>
									// Remove duplicates in case of multiple temp items
									!item.tempId ||
									array.findIndex((i) => i.rqc_id === item.rqc_id) === index
							),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});
		},
	});
};

// Update request_category
export const useUpdateRequestCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRequestCategory,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries({ queryKey: REQUEST_CATEGORY_QUERY_KEY });

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.rqc_id === updatedData.rqc_id
								? { ...item, ...updatedData, isOptimistic: true }
								: item
						),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _updatedData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (updatedDataResponse) => {
			const updatedData = {
				...updatedDataResponse.data,
				...updatedDataResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.rqc_id === updatedData.rqc_id ? updatedData : item
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});
		},
	});
};
// Delete request_category
export const useDeleteRequestCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRequestCategory,

		onMutate: async (id) => {
			await queryClient.cancelQueries(REQUEST_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.filter((item) => item.rqc_id !== parseInt(id)),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _id, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (_deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// This ensures the item is removed after successful deletion
					return {
						...oldData,
						data: oldData.data.filter(
							(item) => item.rqc_id !== parseInt(variable)
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});
		},
	});
};
