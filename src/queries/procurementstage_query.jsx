import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProcurementStage,
	updateProcurementStage,
	addProcurementStage,
	deleteProcurementStage,
} from "../helpers/procurementstage_backend_helper";

const PROCUREMENT_STAGE_QUERY_KEY = ["procurementstage"];
// Fetch procurement_stage
export const useFetchProcurementStages = () => {
	return useQuery({
		queryKey: PROCUREMENT_STAGE_QUERY_KEY,
		queryFn: () => getProcurementStage(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search procurement_stage
export const useSearchProcurementStages = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROCUREMENT_STAGE_QUERY_KEY, searchParams],
		queryFn: () => getProcurementStage(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};
// Add procurement_stage
export const useAddProcurementStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProcurementStage,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROCUREMENT_STAGE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pst_id: tempId };

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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pst_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});
		},
	});
};

// Update procurement_stage
export const useUpdateProcurementStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProcurementStage,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROCUREMENT_STAGE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pst_id === updatedData.pst_id ? { ...d, ...updatedData } : d
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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pst_id === serverData.pst_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});
		},
	});
};

// Delete procurement_stage
export const useDeleteProcurementStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProcurementStage,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROCUREMENT_STAGE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pst_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});
		},
	});
};
