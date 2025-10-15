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
	getOwnUser,
	changeOwnPassword,
	updateOwnProfile,
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

//get user
export const useFetchOwnUser = (id) => {
	return useQuery({
		queryKey: [...USERS_QUERY_KEY, "detail", id],
		queryFn: () => getOwnUser(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
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

			const tempId = Date.now();
			const optimisticData = { ...newData, usr_id: tempId };

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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === serverData.usr_id ? serverData : d
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

// Update profile
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === serverData.usr_id ? serverData : d
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

// Update Own profile
export const useUpdateOwnProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateOwnProfile,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === serverData.usr_id ? serverData : d
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

// Change user status
export const useChangeUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: changeUserStatus,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(USERS_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: USERS_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === updatedData.usr_id ? { ...d, ...updatedData } : d
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
				queryKey: USERS_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.usr_id === serverData.usr_id ? serverData : d
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

export const useChangeOwnPassword = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: changeOwnPassword,
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: USERS_QUERY_KEY,
			});
		},
		meta: {
			skipGlobalErrorHandler: true,
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.usr_id !== parseInt(id)),
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
				queryKey: USERS_QUERY_KEY,
			});
		},
	});
};