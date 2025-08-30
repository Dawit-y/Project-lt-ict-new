import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProject,
	fetchProject,
	updateProject,
	addProject,
	deleteProject,
	getSearchProject,
	getChildProjects,
} from "../helpers/project_backend_helper";

export const PROJECT_QUERY_KEY = ["project"];

// Fetch project
export const useFetchProjects = (param = {}) => {
	return useQuery({
		queryKey: [...PROJECT_QUERY_KEY, "fetch", param],
		queryFn: () => getProject(param),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

export const useSearchOnlyProjects = (param = {}) => {
	return useQuery({
		queryKey: [...PROJECT_QUERY_KEY, "list", param],
		queryFn: () => getSearchProject(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: false,
	});
};

// Fetch single project
export const useFetchProject = (id, userId, isActive = false) => {
	return useQuery({
		queryKey: [...PROJECT_QUERY_KEY, "detail", id, userId],
		queryFn: () => fetchProject(id),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: !!id && !!userId && isActive,
	});
};

//search project
export const useSearchProjects = (searchParams = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_QUERY_KEY, "search", searchParams],
		queryFn: () => getProject(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};

//child project
export const useFetchChildProjects = (searchParams = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_QUERY_KEY, "child", searchParams],
		queryFn: () => getChildProjects(searchParams),
		staleTime: 1000 * 60 * 4,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};

// Add project
export const useAddProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProject,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_QUERY_KEY,
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

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_QUERY_KEY,
			});
		},
	});
};

// Update project
export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProject,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prj_id === updatedData.prj_id ? { ...d, ...updatedData } : d
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

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_QUERY_KEY,
			});
		},
	});
};

// Delete project
export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProject,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((item) => item.prj_id !== parseInt(id)),
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

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_QUERY_KEY,
			});
		},
	});
};
