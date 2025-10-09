import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getStakeholderType,
	updateStakeholderType,
	addStakeholderType,
	deleteStakeholderType,
} from "../helpers/stakeholdertype_backend_helper";

const STAKEHOLDER_TYPE_QUERY_KEY = ["stakeholdertype"];

// Fetch stakeholder_type
export const useFetchStakeholderTypes = () => {
	return useQuery({
		queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
		queryFn: () => getStakeholderType(),
		staleTime: 0,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

//search stakeholder_type
export const useSearchStakeholderTypes = (searchParams = {}) => {
	return useQuery({
		queryKey: [...STAKEHOLDER_TYPE_QUERY_KEY, searchParams],
		queryFn: () => getStakeholderType(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add stakeholder_type
export const useAddStakeholderType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addStakeholderType,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(STAKEHOLDER_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Create a temporary ID for optimistic update
					const tempData = {
						...newData,
						tempId: Date.now(), // Add temporary ID for later matching
						sht_id: `temp-${Date.now()}`, // Temporary ID since we don't have real ID yet
					};

					return {
						...oldData,
						data: [tempData, ...oldData.data], // Add to beginning of array
					};
				});

				return [queryKey, originalData];
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
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Replace temporary item with real data from server
					return {
						...oldData,
						data: oldData.data
							.map((item) => (item.tempId ? newData : item))
							.filter(
								(item, index, array) =>
									// Remove duplicates in case of multiple temp items
									!item.tempId ||
									array.findIndex((i) => i.sht_id === item.sht_id) === index
							),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});
		},
	});
};

// Update stakeholder_type
export const useUpdateStakeholderType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStakeholderType,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(STAKEHOLDER_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.sht_id === updatedData.sht_id
								? { ...item, ...updatedData, isOptimistic: true }
								: item
						),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _updatedData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (updatedDataResponse) => {
			const updatedData = {
				...updatedDataResponse.data,
				...updatedDataResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.sht_id === updatedData.sht_id ? updatedData : item
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});
		},
	});
};

// Delete stakeholder_type 
export const useDeleteStakeholderType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteStakeholderType,

		onMutate: async (id) => {
			await queryClient.cancelQueries(STAKEHOLDER_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.filter((item) => item.sht_id !== parseInt(id)),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _id, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (_deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// This ensures the item is removed after successful deletion
					return {
						...oldData,
						data: oldData.data.filter(
							(item) => item.sht_id !== parseInt(variable)
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});
		},
	});
};
