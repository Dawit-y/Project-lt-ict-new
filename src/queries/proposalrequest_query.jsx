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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prr_id === updatedData.data.prr_id
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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.prr_id === updatedData.data.prr_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prr_id !== parseInt(id)),
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
				queryKey: PROPOSAL_REQUEST_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prr_id !== parseInt(variable)),
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
