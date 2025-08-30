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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pst_id === updatedData.data.pst_id
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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pst_id === updatedData.data.pst_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pst_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_STAGE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pst_id !== parseInt(variable)),
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
