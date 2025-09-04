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

			const tempId = Date.now();
			const optimisticData = { ...newData, rqi_id: tempId };

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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqi_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqi_id === updatedData.rqi_id ? { ...d, ...updatedData } : d
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqi_id === serverData.rqi_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqi_id !== parseInt(id)),
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
				queryKey: REQUEST_INFORMATION_QUERY_KEY,
			});
		},
	});
};
