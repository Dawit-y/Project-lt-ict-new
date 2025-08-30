import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRequestInformation,
	updateRequestInformation,
	addRequestInformation,
	deleteRequestInformation,
} from "../helpers/requestinformation_backend_helper";

const REQUEST_INFORMATION_QUERY_KEY = ["requestinformation"];

// Fetch request_information
export const useFetchRequestInformations = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...REQUEST_INFORMATION_QUERY_KEY, "fetch", param],
		queryFn: () => getRequestInformation(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search request_information
export const useSearchRequestInformations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...REQUEST_INFORMATION_QUERY_KEY, "search", searchParams],
		queryFn: () => getRequestInformation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add request_information
export const useAddRequestInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addRequestInformation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(REQUEST_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Update request_information
export const useUpdateRequestInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRequestInformation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(REQUEST_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqi_id === updatedData.data.rqi_id
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.rqi_id === updatedData.data.rqi_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Delete request_information
export const useDeleteRequestInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRequestInformation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(REQUEST_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqi_id !== parseInt(id)),
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqi_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});
		},
	});
};
