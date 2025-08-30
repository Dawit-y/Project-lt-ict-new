import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getUserRole,
	addUserRole,
	updateUserRole,
	deleteUserRole,
} from "../helpers/userrole_backend_helper";

const USER_ROLE_QUERY_KEY = ["user_role"];

// Fetch roles
export const useFetchUserRoles = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...USER_ROLE_QUERY_KEY, "fetch", param],
		queryFn: () => getUserRole(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search roles
export const useSearchUserRoles = (searchParams = {}) => {
	return useQuery({
		queryKey: [...USER_ROLE_QUERY_KEY, "search", searchParams],
		queryFn: () => getUserRole(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add roles
export const useAddUserRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addUserRole,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(USER_ROLE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USER_ROLE_QUERY_KEY,
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
				queryKey: USER_ROLE_QUERY_KEY,
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
				queryKey: USER_ROLE_QUERY_KEY,
			});
		},
	});
};

// Update roles
export const useUpdateUserRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUserRole,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USER_ROLE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USER_ROLE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.url_id === updatedData.data.url_id
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
				queryKey: USER_ROLE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.url_id === updatedData.data.url_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USER_ROLE_QUERY_KEY,
			});
		},
	});
};

// Delete roles
export const useDeleteUserRoles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUserRole,

		onMutate: async (id) => {
			await queryClient.cancelQueries(USER_ROLE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USER_ROLE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.url_id !== parseInt(id)),
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
				queryKey: USER_ROLE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.url_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USER_ROLE_QUERY_KEY,
			});
		},
	});
};
