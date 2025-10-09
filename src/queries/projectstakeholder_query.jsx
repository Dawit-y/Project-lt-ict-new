import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectStakeholder,
	updateProjectStakeholder,
	addProjectStakeholder,
	deleteProjectStakeholder,
} from "../helpers/projectstakeholder_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_STAKEHOLDER_QUERY_KEY = ["projectstakeholder"];

// Fetch project_stakeholder
export const useFetchProjectStakeholders = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectStakeholder(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_stakeholder
export const useSearchProjectStakeholders = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectStakeholder(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_stakeholder
export const useAddProjectStakeholder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectStakeholder,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, psh_id: tempId };

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
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psh_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_stakeholder
export const useUpdateProjectStakeholder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectStakeholder,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psh_id === updatedData.psh_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psh_id === serverData.psh_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_stakeholder
export const useDeleteProjectStakeholder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectStakeholder,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.psh_id !== parseInt(id)),
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
				queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
