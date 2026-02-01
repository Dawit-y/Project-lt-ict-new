import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectEvaluation,
	updateProjectEvaluation,
	addProjectEvaluation,
	deleteProjectEvaluation,
} from "../helpers/project_evaluation_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_EVALUATION_QUERY_KEY = ["project_evaluation"];

// Fetch project_monitoring_evaluation
export const useFetchProjectEvaluations = (param, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_EVALUATION_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectEvaluation(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_evaluation
export const useSearchProjectEvaluations = (searchParams = {}) => {
	return useQuery({
		queryKey: [
			...PROJECT_EVALUATION_QUERY_KEY,
			"search",
			searchParams,
		],
		queryFn: () => getProjectEvaluation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add project_evaluation
export const useAddProjectEvaluation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectEvaluation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_EVALUATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, mne_id: tempId };

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
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.mne_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_evaluation
export const useUpdateProjectEvaluation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectEvaluation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_EVALUATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.mne_id === updatedData.mne_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.mne_id === serverData.mne_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_evaluation
export const useDeleteProjectEvaluation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectEvaluation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_EVALUATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.mne_id !== parseInt(id)),
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
				queryKey: PROJECT_EVALUATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
