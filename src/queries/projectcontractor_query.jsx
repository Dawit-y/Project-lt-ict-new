import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectContractor,
	updateProjectContractor,
	addProjectContractor,
	deleteProjectContractor,
} from "../helpers/projectcontractor_backend_helper";

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

		onSuccess: (newDataResponse) => {
			const newData = {
				...newDataResponse.data,
				...newDataResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.tempId === newData.tempId ? newData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cni_id === updatedData.cni_id ? { ...d, ...updatedData } : d
						),
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
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((item) => item.cni_id !== parseInt(id)),
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
				queryKey: PROJECT_CONTRACTOR_QUERY_KEY,
			});
		},
	});
};
