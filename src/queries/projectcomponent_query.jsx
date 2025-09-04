import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectComponent,
	updateProjectComponent,
	addProjectComponent,
	deleteProjectComponent,
} from "../helpers/projectcomponent_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_COMPONENT_QUERY_KEY = ["projectcomponent"];
// Fetch project_component
export const useFetchProjectComponents = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_COMPONENT_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectComponent(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search project_component
export const useSearchProjectComponents = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_COMPONENT_QUERY_KEY, searchParams],
		queryFn: () => getProjectComponent(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add project_component
export const useAddProjectComponent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectComponent,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pcm_id: tempId };

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
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pcm_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_component
export const useUpdateProjectComponent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectComponent,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pcm_id === updatedData.pcm_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pcm_id === serverData.pcm_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_component
export const useDeleteProjectComponent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectComponent,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pcm_id !== parseInt(id)),
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

		onSuccess: (response) => {
			const deletedId = parseInt(response.deleted_id);

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pcm_id !== deletedId),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_COMPONENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
