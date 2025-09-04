import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectKpi,
	updateProjectKpi,
	addProjectKpi,
	deleteProjectKpi,
} from "../helpers/projectkpi_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_KPI_QUERY_KEY = ["projectkpi"];
// Fetch project_kpi
export const useFetchProjectKpis = () => {
	return useQuery({
		queryKey: PROJECT_KPI_QUERY_KEY,
		queryFn: () => getProjectKpi(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search project_kpi
export const useSearchProjectKpis = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_KPI_QUERY_KEY, searchParams],
		queryFn: () => getProjectKpi(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add project_kpi
export const useAddProjectKpi = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectKpi,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, kpi_id: tempId };

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
				queryKey: PROJECT_KPI_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpi_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_KPI_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_kpi
export const useUpdateProjectKpi = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectKpi,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpi_id === updatedData.kpi_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_KPI_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.kpi_id === serverData.kpi_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_KPI_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_kpi
export const useDeleteProjectKpi = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectKpi,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_KPI_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.kpi_id !== parseInt(id)),
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
				queryKey: PROJECT_KPI_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
