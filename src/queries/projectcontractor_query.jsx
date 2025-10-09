import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectContractor,
	updateProjectContractor,
	addProjectContractor,
	deleteProjectContractor,
} from "../helpers/projectcontractor_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_CONTRACTOR_QUERY_KEY = ["projectcontractor"];

// Fetch project_contractor
export const useFetchProjectContractors = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_CONTRACTOR_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectContractor(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_contractor
export const useSearchProjectContractors = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_CONTRACTOR_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectContractor(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add project_contractor
export const useAddProjectContractor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectContractor,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_CONTRACTOR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, cni_id: tempId };

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
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cni_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_contractor
export const useUpdateProjectContractor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectContractor,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_CONTRACTOR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cni_id === updatedData.cni_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cni_id === serverData.cni_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_contractor
export const useDeleteProjectContractor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectContractor,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_CONTRACTOR_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cni_id !== parseInt(id)),
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
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cni_id !== deletedId),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
