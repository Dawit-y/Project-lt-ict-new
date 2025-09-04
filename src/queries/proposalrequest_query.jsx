import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProposalRequest,
	updateProposalRequest,
	addProposalRequest,
	deleteProposalRequest,
} from "../helpers/proposalrequest_backend_helper";

const PROPOSAL_REQUEST_QUERY_KEY = ["proposalrequest"];

// Fetch proposal_request
export const useFetchProposalRequests = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROPOSAL_REQUEST_QUERY_KEY, "fetch", param],
		queryFn: () => getProposalRequest(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search proposal_request
export const useSearchProposalRequests = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROPOSAL_REQUEST_QUERY_KEY, "search", searchParams],
		queryFn: () => getProposalRequest(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add proposal_request
export const useAddProposalRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProposalRequest,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROPOSAL_REQUEST_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prr_id: tempId };

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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prr_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});
		},
	});
};

// Update proposal_request
export const useUpdateProposalRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProposalRequest,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROPOSAL_REQUEST_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prr_id === updatedData.prr_id ? { ...d, ...updatedData } : d
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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prr_id === serverData.prr_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});
		},
	});
};

// Delete proposal_request
export const useDeleteProposalRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProposalRequest,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROPOSAL_REQUEST_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prr_id !== parseInt(id)),
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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});
		},
	});
};
