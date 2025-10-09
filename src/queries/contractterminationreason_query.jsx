import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getContractTerminationReason,
	updateContractTerminationReason,
	addContractTerminationReason,
	deleteContractTerminationReason,
} from "../helpers/contractterminationreason_backend_helper";

const CONTRACT_TERMINATION_REASON_QUERY_KEY = ["contractterminationreason"];

// Fetch contract_termination_reason
export const useFetchContractTerminationReasons = () => {
	return useQuery({
		queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
		queryFn: () => getContractTerminationReason(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search contract_termination_reason
export const useSearchContractTerminationReasons = (searchParams = {}) => {
	return useQuery({
		queryKey: [...CONTRACT_TERMINATION_REASON_QUERY_KEY, searchParams],
		queryFn: () => getContractTerminationReason(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add contract_termination_reason
export const useAddContractTerminationReason = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addContractTerminationReason,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, ctr_id: tempId };

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
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ctr_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});
		},
	});
};

// Update contract_termination_reason
export const useUpdateContractTerminationReason = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateContractTerminationReason,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ctr_id === updatedData.ctr_id ? { ...d, ...updatedData } : d
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
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ctr_id === serverData.ctr_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});
		},
	});
};

// Delete contract_termination_reason
export const useDeleteContractTerminationReason = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteContractTerminationReason,

		onMutate: async (id) => {
			await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.ctr_id !== parseInt(id)),
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
				queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
			});
		},
	});
};
