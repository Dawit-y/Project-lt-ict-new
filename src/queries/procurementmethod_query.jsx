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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prm_id === updatedData.data.prm_id
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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.prm_id === updatedData.data.prm_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prm_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_METHOD_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prm_id !== parseInt(variable)),
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