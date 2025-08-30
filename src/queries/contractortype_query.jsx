import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getContractorType,
	updateContractorType,
	addContractorType,
	deleteContractorType,
} from "../helpers/contractortype_backend_helper";

const CONTRACTOR_TYPE_QUERY_KEY = ["contractortype"];

// Fetch contractor_type
export const useFetchContractorTypes = () => {
	return useQuery({
		queryKey: CONTRACTOR_TYPE_QUERY_KEY,
		queryFn: () => getContractorType(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search contractor_type
export const useSearchContractorTypes = (searchParams = {}) => {
	return useQuery({
		queryKey: [...CONTRACTOR_TYPE_QUERY_KEY, searchParams],
		queryFn: () => getContractorType(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add contractor_type
export const useAddContractorType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addContractorType,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(CONTRACTOR_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});
		},
	});
};

// Update contractor_type
export const useUpdateContractorType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateContractorType,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(CONTRACTOR_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cnt_id === updatedData.data.cnt_id
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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cnt_id === updatedData.data.cnt_id
								? { ...d, ...updatedData.data }
								: d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});
		},
	});
};

// Delete contractor_type
export const useDeleteContractorType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteContractorType,

		onMutate: async (id) => {
			await queryClient.cancelQueries(CONTRACTOR_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cnt_id !== parseInt(id)),
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

		onSuccess: (_deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cnt_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});
		},
	});
};
