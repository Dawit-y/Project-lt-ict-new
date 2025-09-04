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

			const tempId = Date.now();
			const optimisticData = { ...newData, cnt_id: tempId };

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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cnt_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cnt_id === updatedData.cnt_id ? { ...d, ...updatedData } : d
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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cnt_id === serverData.cnt_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cnt_id !== parseInt(id)),
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
				queryKey: CONTRACTOR_TYPE_QUERY_KEY,
			});
		},
	});
};
