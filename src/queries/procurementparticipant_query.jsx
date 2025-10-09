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

			const tempId = Date.now();
			const optimisticData = { ...newData, ppp_id: tempId };

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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ppp_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ppp_id === updatedData.ppp_id ? { ...d, ...updatedData } : d
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.ppp_id === serverData.ppp_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.ppp_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
			});
		},
	});
};
