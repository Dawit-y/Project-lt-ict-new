import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectCategory,
	updateProjectCategory,
	addProjectCategory,
	deleteProjectCategory,
} from "../helpers/projectcategory_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_CATEGORY_QUERY_KEY = ["projectcategory"];

// Fetch project_category
export const useFetchProjectCategorys = () => {
	return useQuery({
		queryKey: PROJECT_CATEGORY_QUERY_KEY,
		queryFn: () => getProjectCategory(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search project_category
export const useSearchProjectCategorys = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_CATEGORY_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectCategory(searchParams),
		staleTime: 1000 * 60 * 5,
		meta: { persist: false },
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: Object.keys(searchParams).length > 0,
	});
};

// Add project_category
export const useAddProjectCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectCategory,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pct_id: tempId };

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
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pct_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_category
export const useUpdateProjectCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectCategory,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pct_id === updatedData.pct_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pct_id === serverData.pct_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_category
export const useDeleteProjectCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectCategory,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pct_id !== parseInt(id)),
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
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pct_id !== deletedId),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CATEGORY_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
