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
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
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
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.sht_id === updatedData.data.sht_id
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
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.sht_id === updatedData.data.sht_id
								? { ...data, ...updatedData.data }
								: data
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
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.sht_id !== parseInt(id)),
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
				queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.sht_id !== parseInt(variable)),
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
