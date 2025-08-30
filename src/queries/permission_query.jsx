import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPermission,
	addPermission,
	updatePermission,
	deletePermission,
	getRoleAssignedPermission,
	getUserAssignedPermission,
} from "../helpers/permission_backend_helper";

const PERMISSION_QUERY_KEY = ["permission"];
const ROLE_ASSIGNED_PERMISSION_QUERY_KEY = ["assigned_permission"];
const USER_ASSIGNED_PERMISSION_QUERY_KEY = ["user_assigned_permission"];

// Fetch permission
export const useFetchPermissions = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PERMISSION_QUERY_KEY, "fetch", param],
		queryFn: () => getPermission(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

export const useFetchRoleAssignedPermissions = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...ROLE_ASSIGNED_PERMISSION_QUERY_KEY, "fetch", param],
		queryFn: () => getRoleAssignedPermission(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

export const useFetchUserAssignedPermissions = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...USER_ASSIGNED_PERMISSION_QUERY_KEY, "fetch", param],
		queryFn: () => getUserAssignedPermission(param),
		staleTime: 1000 * 60 * 5,

		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: true,
	});
};

//search permission
export const useSearchPermissions = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PERMISSION_QUERY_KEY, "search", searchParams],
		queryFn: () => getPermission(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add permission
export const useAddPermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addPermission,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PERMISSION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PERMISSION_QUERY_KEY,
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
				queryKey: PERMISSION_QUERY_KEY,
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
				queryKey: PERMISSION_QUERY_KEY,
			});
		},
	});
};

// Update permission
export const useUpdatePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePermission,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PERMISSION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PERMISSION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d?.pag_name?.toString() ===
							updatedData?.data?.pag_name?.toString()
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
				queryKey: PERMISSION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data?.pag_name?.toString() ===
							updatedData?.data?.pag_name?.toString()
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PERMISSION_QUERY_KEY,
			});
		},
	});
};

// Delete permission
export const useDeletePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePermission,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PERMISSION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PERMISSION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pem_id !== parseInt(id)),
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
				queryKey: PERMISSION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pem_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PERMISSION_QUERY_KEY,
			});
		},
	});
};
