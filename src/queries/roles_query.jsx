import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRoles,
	addRoles,
	updateRoles,
	deleteRoles,
} from "../helpers/roles_backend_helper";

const ROLES_QUERY_KEY = ["roles"];

// Fetch roles
export const useFetchRoles = () => {
	return useQuery({
		queryKey: ROLES_QUERY_KEY,
		queryFn: () => getRoles(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search roles
export const useSearchRoles = (searchParams = {}) => {
	return useQuery({
		queryKey: [...ROLES_QUERY_KEY, "search", searchParams],
		queryFn: () => getRoles(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add roles
export const useAddRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addRoles,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(ROLES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: ROLES_QUERY_KEY,
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
				queryKey: ROLES_QUERY_KEY,
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
				queryKey: ROLES_QUERY_KEY,
			});
		},
	});
};

// Update roles
export const useUpdateRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRoles,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(ROLES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: ROLES_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rol_id === updatedData.data.rol_id
								? { ...d, ...updatedData.data }
								: d
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

		onSuccess: (updatedData) => {
			const queries = queryClient.getQueriesData({
				queryKey: ROLES_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.rol_id === updatedData.data.rol_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ROLES_QUERY_KEY,
			});
		},
	});
};

// Delete roles
export const useDeleteRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRoles,

		onMutate: async (id) => {
			await queryClient.cancelQueries(ROLES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: ROLES_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rol_id !== parseInt(id)),
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

		onSuccess: (deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: ROLES_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rol_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ROLES_QUERY_KEY,
			});
		},
	});
};
