import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRequestFollowup,
	updateRequestFollowup,
	addRequestFollowup,
	deleteRequestFollowup,
} from "../helpers/requestfollowup_backend_helper";

const REQUEST_FOLLOWUP_QUERY_KEY = ["requestfollowup"];

// Fetch request_followup
export const useFetchRequestFollowups = () => {
	return useQuery({
		queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
		queryFn: () => getRequestFollowup(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search request_followup
export const useSearchRequestFollowups = (searchParams = {}, enabled) => {
	return useQuery({
		queryKey: [...REQUEST_FOLLOWUP_QUERY_KEY, searchParams],
		queryFn: () => getRequestFollowup(searchParams),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled,
	});
};

// Add request_followup
export const useAddRequestFollowup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addRequestFollowup,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(REQUEST_FOLLOWUP_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});
		},
	});
};

// Update request_followup
export const useUpdateRequestFollowup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRequestFollowup,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(REQUEST_FOLLOWUP_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqf_id === updatedData.data.rqf_id
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.rqf_id === updatedData.data.rqf_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});
		},
	});
};

// Delete request_followup
export const useDeleteRequestFollowup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRequestFollowup,

		onMutate: async (id) => {
			await queryClient.cancelQueries(REQUEST_FOLLOWUP_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqf_id !== parseInt(id)),
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqf_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});
		},
	});
};
