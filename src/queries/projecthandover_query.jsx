import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectHandover,
	updateProjectHandover,
	addProjectHandover,
	deleteProjectHandover,
} from "../helpers/projecthandover_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_HANDOVER_QUERY_KEY = ["projecthandover"];

// Fetch project_handover
export const useFetchProjectHandovers = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_HANDOVER_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectHandover(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_handover
export const useSearchProjectHandovers = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_HANDOVER_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectHandover(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_handover
export const useAddProjectHandover = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectHandover,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_HANDOVER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prh_id: tempId };

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
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prh_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_handover
export const useUpdateProjectHandover = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectHandover,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_HANDOVER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prh_id === updatedData.prh_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prh_id === serverData.prh_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_handover
export const useDeleteProjectHandover = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectHandover,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_HANDOVER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prh_id !== parseInt(id)),
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
				queryKey: PROJECT_HANDOVER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
