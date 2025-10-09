import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectSupplimentary,
	updateProjectSupplimentary,
	addProjectSupplimentary,
	deleteProjectSupplimentary,
} from "../helpers/projectsupplimentary_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_SUPPLIMENTARY_QUERY_KEY = ["projectsupplimentary"];

// Fetch project_supplimentary
export const useFetchProjectSupplimentarys = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectSupplimentary(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_supplimentary
export const useSearchProjectSupplimentarys = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectSupplimentary(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_supplimentary
export const useAddProjectSupplimentary = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectSupplimentary,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prs_id: tempId };

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
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prs_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_supplimentary
export const useUpdateProjectSupplimentary = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectSupplimentary,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prs_id === updatedData.prs_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prs_id === serverData.prs_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_supplimentary
export const useDeleteProjectSupplimentary = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectSupplimentary,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prs_id !== parseInt(id)),
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
				queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
