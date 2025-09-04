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

			const tempId = Date.now();
			const optimisticData = { ...newData, url_id: tempId };

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
				queryKey: USER_ROLE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.url_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.url_id === updatedData.url_id ? { ...d, ...updatedData } : d
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
				queryKey: USER_ROLE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.url_id === serverData.url_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.url_id !== parseInt(id)),
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
				queryKey: USER_ROLE_QUERY_KEY,
			});
		},
	});
};
