import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectPerformance,
	updateProjectPerformance,
	addProjectPerformance,
	deleteProjectPerformance,
} from "../helpers/projectperformance_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_PERFORMANCE_QUERY_KEY = ["projectperformance"];

// Fetch project_performance
export const useFetchProjectPerformances = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectPerformance(param),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_performance
export const useSearchProjectPerformances = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectPerformance(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_performance
export const useAddProjectPerformance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectPerformance,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_PERFORMANCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prp_id: tempId };

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
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_performance
export const useUpdateProjectPerformance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectPerformance,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_PERFORMANCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === updatedData.prp_id ? { ...d, ...updatedData } : d
						),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _newData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_performance
export const useDeleteProjectPerformance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectPerformance,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_PERFORMANCE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prp_id !== parseInt(id)),
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
				queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
