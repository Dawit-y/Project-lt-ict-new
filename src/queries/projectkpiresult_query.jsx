import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectKpiResult,
	updateProjectKpiResult,
	addProjectKpiResult,
	deleteProjectKpiResult,
} from "../helpers/projectkpiresult_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_KPI_RESULT_QUERY_KEY = ["projectkpiresult"];
// Fetch project_kpi_result
export const useFetchProjectKpiResults = () => {
	return useQuery({
		queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
		queryFn: () => getProjectKpiResult(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search project_kpi_result
export const useSearchProjectKpiResults = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_KPI_RESULT_QUERY_KEY, searchParams],
		queryFn: () => getProjectKpiResult(searchParams),
		staleTime: 1000 * 60 * 2,
		//gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: false,
	});
};
// Add project_kpi_result
export const useAddProjectKpiResult = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectKpiResult,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, kpr_id: tempId };

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
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpr_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_kpi_result
export const useUpdateProjectKpiResult = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectKpiResult,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpr_id === updatedData.kpr_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpr_id === serverData.kpr_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_kpi_result
export const useDeleteProjectKpiResult = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectKpiResult,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.kpr_id !== parseInt(id)),
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
				queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
