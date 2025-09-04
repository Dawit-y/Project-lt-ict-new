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

			const tempId = Date.now();
			const optimisticData = { ...newData, pem_id: tempId };

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
				queryKey: PERMISSION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pem_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d?.pag_name?.toString() === updatedData?.pag_name?.toString()
								? { ...d, ...updatedData }
								: d
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
				queryKey: PERMISSION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d?.pag_name?.toString() === serverData?.pag_name?.toString()
								? serverData
								: d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pem_id !== parseInt(id)),
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
				queryKey: PERMISSION_QUERY_KEY,
			});
		},
	});
};
