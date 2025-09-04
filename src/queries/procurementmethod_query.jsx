import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProcurementMethod,
	updateProcurementMethod,
	addProcurementMethod,
	deleteProcurementMethod,
} from "../helpers/procurementmethod_backend_helper";

const PROCUREMENT_METHOD_QUERY_KEY = ["procurementmethod"];
// Fetch procurement_method
export const useFetchProcurementMethods = () => {
	return useQuery({
		queryKey: PROCUREMENT_METHOD_QUERY_KEY,
		queryFn: () => getProcurementMethod(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search procurement_method
export const useSearchProcurementMethods = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROCUREMENT_METHOD_QUERY_KEY, searchParams],
		queryFn: () => getProcurementMethod(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};
// Add procurement_method
export const useAddProcurementMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProcurementMethod,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROCUREMENT_METHOD_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prm_id: tempId };

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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prm_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});
		},
	});
};

// Update procurement_method
export const useUpdateProcurementMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProcurementMethod,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROCUREMENT_METHOD_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prm_id === updatedData.prm_id ? { ...d, ...updatedData } : d
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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prm_id === serverData.prm_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});
		},
	});
};

// Delete procurement_method
export const useDeleteProcurementMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProcurementMethod,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROCUREMENT_METHOD_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prm_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});
		},
	});
};
