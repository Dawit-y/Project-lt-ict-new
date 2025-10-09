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

			const tempId = Date.now();
			const optimisticData = { ...newData, met_id: tempId };

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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.met_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.met_id === updatedData.met_id ? { ...d, ...updatedData } : d
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.met_id === serverData.met_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.met_id !== id),
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
				queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
			});
		},
	});
};
