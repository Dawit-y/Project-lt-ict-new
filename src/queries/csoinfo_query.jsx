import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getCsoInfo,
	updateCsoInfo,
	addCsoInfo,
	deleteCsoInfo,
} from "../helpers/csoinfo_backend_helper";

export const CSO_INFO_QUERY_KEY = ["csoinfo"];

// Fetch cso_info
export const useFetchCsoInfos = () => {
	return useQuery({
		queryKey: CSO_INFO_QUERY_KEY,
		queryFn: () => getCsoInfo(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search cso_info
export const useSearchCsoInfos = (searchParams = {}) => {
	return useQuery({
		queryKey: [...CSO_INFO_QUERY_KEY, searchParams],
		queryFn: () => getCsoInfo(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add cso_info
export const useAddCsoInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addCsoInfo,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(CSO_INFO_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_INFO_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, cso_id: tempId };

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
				queryKey: CSO_INFO_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cso_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_INFO_QUERY_KEY,
			});
		},
	});
};

// Update cso_info
export const useUpdateCsoInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCsoInfo,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(CSO_INFO_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_INFO_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cso_id === updatedData.cso_id ? { ...d, ...updatedData } : d
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
				queryKey: CSO_INFO_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cso_id === serverData.cso_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_INFO_QUERY_KEY,
			});
		},
	});
};

// Delete cso_info
export const useDeleteCsoInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCsoInfo,

		onMutate: async (id) => {
			await queryClient.cancelQueries(CSO_INFO_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_INFO_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cso_id !== parseInt(id)),
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
				queryKey: CSO_INFO_QUERY_KEY,
			});
		},
	});
};
