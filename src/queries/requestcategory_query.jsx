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

// Add request_category
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
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
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
			await queryClient.cancelQueries(REQUEST_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqc_id === updatedData.data.rqc_id
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
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.rqc_id === updatedData.data.rqc_id
								? { ...data, ...updatedData.data }
								: data
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
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqc_id !== parseInt(id)),
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
				queryKey: REQUEST_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqc_id !== parseInt(variable)),
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
