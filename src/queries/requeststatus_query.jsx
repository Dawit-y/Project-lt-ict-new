import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRequestStatus,
	updateRequestStatus,
	addRequestStatus,
	deleteRequestStatus,
} from "../helpers/requeststatus_backend_helper";

const REQUEST_STATUS_QUERY_KEY = ["requeststatus"];

// Fetch request_status
export const useFetchRequestStatuss = () => {
	return useQuery({
		queryKey: REQUEST_STATUS_QUERY_KEY,
		queryFn: () => getRequestStatus(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search request_status
export const useSearchRequestStatuss = (searchParams = {}) => {
	return useQuery({
		queryKey: [...REQUEST_STATUS_QUERY_KEY, searchParams],
		queryFn: () => getRequestStatus(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add request_status
export const useAddRequestStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addRequestStatus,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(REQUEST_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, rqs_id: tempId };

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
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqs_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});
		},
	});
};

// Update request_status
export const useUpdateRequestStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRequestStatus,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(REQUEST_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqs_id === updatedData.rqs_id ? { ...d, ...updatedData } : d
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
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqs_id === serverData.rqs_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});
		},
	});
};

// Delete request_status
export const useDeleteRequestStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRequestStatus,

		onMutate: async (id) => {
			await queryClient.cancelQueries(REQUEST_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqs_id !== parseInt(id)),
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
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});
		},
	});
};
