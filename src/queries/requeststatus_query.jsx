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
				queryKey: REQUEST_STATUS_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqs_id === updatedData.data.rqs_id
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
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.rqs_id === updatedData.data.rqs_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqs_id !== parseInt(id)),
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
				queryKey: REQUEST_STATUS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqs_id !== parseInt(variable)),
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
