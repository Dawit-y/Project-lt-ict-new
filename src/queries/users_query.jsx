import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getUsers,
	updateUsers,
	addUsers,
	deleteUsers,
	changeUserStatus,
	changePassword,
	updateProfile,
	getUser,
} from "../helpers/users_backend_helper";

const USERS_QUERY_KEY = ["users"];

// Fetch users
export const useFetchUserss = () => {
	return useQuery({
		queryKey: USERS_QUERY_KEY,
		queryFn: () => getUsers(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

//search users
export const useFetchUser = (searchParams = {}) => {
	return useQuery({
		queryKey: [...USERS_QUERY_KEY, "detail", searchParams],
		queryFn: () => getUser(searchParams),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

//search users
export const useSearchUserss = (searchParams = {}) => {
	return useQuery({
		queryKey: [...USERS_QUERY_KEY, "search", searchParams],
		queryFn: () => getUsers(searchParams),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

// Add users
export const useAddUsers = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addUsers,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
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
			};

			const queries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
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
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};

// Update users
export const useUpdateUsers = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUsers,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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

		onSuccess: (updatedUsers) => {
			const queries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((UsersData) =>
							UsersData.usr_id === updatedUsers.data.usr_id
								? { ...UsersData, ...updatedUsers.data }
								: UsersData
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};

// Update users
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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

		onSuccess: (updatedUsers) => {
			const queries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((UsersData) =>
							UsersData.usr_id === updatedUsers.data.usr_id
								? { ...UsersData, ...updatedUsers.data }
								: UsersData
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};

export const useChangeUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: changeUserStatus,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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

		onSuccess: (updatedUsers) => {
			console.log("uo", updatedUsers)
			const queries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((UsersData) =>
							UsersData.usr_id === updatedUsers.data.usr_id
								? { ...UsersData, ...updatedUsers.data }
								: UsersData
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};

export const useChangePassword = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: changePassword,
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};

// Delete users
export const useDeleteUsers = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUsers,

		onMutate: async (id) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(UsersData) => UsersData.usr_id !== parseInt(id)
						),
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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(UsersData) => UsersData.usr_id !== parseInt(variable)
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};
