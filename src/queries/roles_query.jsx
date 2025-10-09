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

			const tempId = Date.now();
			const optimisticData = { ...newData, rol_id: tempId };

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
				queryKey: ROLES_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rol_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rol_id === updatedData.rol_id ? { ...d, ...updatedData } : d
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
				queryKey: ROLES_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rol_id === serverData.rol_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rol_id !== parseInt(id)),
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
				queryKey: ROLES_QUERY_KEY,
			});
		},
	});
};
