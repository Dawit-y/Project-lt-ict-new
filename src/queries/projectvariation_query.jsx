import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectVariation,
	updateProjectVariation,
	addProjectVariation,
	deleteProjectVariation,
} from "../helpers/projectvariation_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_VARIATION_QUERY_KEY = ["projectvariation"];

// Fetch project_variation
export const useFetchProjectVariations = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_VARIATION_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectVariation(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_variation
export const useSearchProjectVariations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_VARIATION_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectVariation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_variation
export const useAddProjectVariation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectVariation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_VARIATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prv_id: tempId };

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
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prv_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_variation
export const useUpdateProjectVariation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectVariation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_VARIATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prv_id === updatedData.prv_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prv_id === serverData.prv_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_variation
export const useDeleteProjectVariation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectVariation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_VARIATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prv_id !== parseInt(id)),
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
				queryKey: PROJECT_VARIATION_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
