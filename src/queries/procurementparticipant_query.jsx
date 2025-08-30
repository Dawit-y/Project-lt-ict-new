import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProcurementParticipant,
	updateProcurementParticipant,
	addProcurementParticipant,
	deleteProcurementParticipant,
} from "../helpers/procurementparticipant_backend_helper";

const PROCUREMENT_PARTICIPANT_QUERY_KEY = ["procurementparticipant"];
// Fetch procurement_participant
export const useFetchProcurementParticipants = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROCUREMENT_PARTICIPANT_QUERY_KEY, param],
		queryFn: () => getProcurementParticipant(param),
		staleTime: 1000 * 60 * 1,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};

//search procurement_participant
export const useSearchProcurementParticipants = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROCUREMENT_PARTICIPANT_QUERY_KEY, searchParams],
		queryFn: () => getProcurementParticipant(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add procurement_participant
export const useAddProcurementParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProcurementParticipant,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROCUREMENT_PARTICIPANT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});
		},
	});
};

// Update procurement_participant
export const useUpdateProcurementParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProcurementParticipant,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROCUREMENT_PARTICIPANT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ppp_id === updatedData.data.ppp_id
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.ppp_id === updatedData.data.ppp_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});
		},
	});
};

// Delete procurement_participant
export const useDeleteProcurementParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProcurementParticipant,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROCUREMENT_PARTICIPANT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.ppp_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.ppp_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});
		},
	});
};
