import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getMonitoringEvaluationType,
	updateMonitoringEvaluationType,
	addMonitoringEvaluationType,
	deleteMonitoringEvaluationType,
} from "../helpers/monitoringevaluationtype_backend_helper";

const MONITORING_EVALUATION_TYPE_QUERY_KEY = ["monitoringevaluationtype"];
// Fetch monitoring_evaluation_type
export const useFetchMonitoringEvaluationTypes = () => {
	return useQuery({
		queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
		queryFn: () => getMonitoringEvaluationType(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search monitoring_evaluation_type
export const useSearchMonitoringEvaluationTypes = (searchParams = {}) => {
	return useQuery({
		queryKey: [...MONITORING_EVALUATION_TYPE_QUERY_KEY, searchParams],
		queryFn: () => getMonitoringEvaluationType(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add monitoring_evaluation_type
export const useAddMonitoringEvaluationType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addMonitoringEvaluationType,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(MONITORING_EVALUATION_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});
		},
	});
};

// Update monitoring_evaluation_type
export const useUpdateMonitoringEvaluationType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateMonitoringEvaluationType,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(MONITORING_EVALUATION_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.met_id === updatedData.data.met_id
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.met_id === updatedData.data.met_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});
		},
	});
};

// Delete monitoring_evaluation_type
export const useDeleteMonitoringEvaluationType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteMonitoringEvaluationType,

		onMutate: async (id) => {
			await queryClient.cancelQueries(MONITORING_EVALUATION_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.met_id !== parseInt(id)),
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.met_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});
		},
	});
};
