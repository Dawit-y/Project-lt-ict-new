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

			const tempId = Date.now();
			const optimisticData = { ...newData, rqf_id: tempId };

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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqf_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqf_id === updatedData.rqf_id ? { ...d, ...updatedData } : d
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rqf_id === serverData.rqf_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rqf_id !== parseInt(id)),
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
				queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
			});
		},
	});
};
