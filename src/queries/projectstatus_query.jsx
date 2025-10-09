import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectStatus,
	updateProjectStatus,
	addProjectStatus,
	deleteProjectStatus,
} from "../helpers/projectstatus_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_STATUS_QUERY_KEY = ["projectstatus"];

// Fetch project_status
export const useFetchProjectStatuss = () => {
	return useQuery({
		queryKey: PROJECT_STATUS_QUERY_KEY,
		queryFn: () => getProjectStatus(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search project_status
export const useSearchProjectStatuss = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_STATUS_QUERY_KEY, searchParams],
		queryFn: () => getProjectStatus(searchParams),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

// Add project_status
export const useAddProjectStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectStatus,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STATUS_QUERY_KEY,
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
				queryKey: PROJECT_STATUS_QUERY_KEY,
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
				queryKey: PROJECT_STATUS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_status
export const useUpdateProjectStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectStatus,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STATUS_QUERY_KEY,
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
				queryKey: PROJECT_STATUS_QUERY_KEY,
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
				queryKey: PROJECT_STATUS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_status
export const useDeleteProjectStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectStatus,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STATUS_QUERY_KEY,
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
				queryKey: PROJECT_STATUS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
