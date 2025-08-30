import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getCsoInfo,
	updateCsoInfo,
	addCsoInfo,
	deleteCsoInfo,
} from "../helpers/csoinfo_backend_helper";

const CSO_INFO_QUERY_KEY = ["csoinfo"];

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
				queryKey: CSO_INFO_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.cso_id === updatedData.data.cso_id
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

		onSuccess: (updatedCsoInfo) => {
			const queries = queryClient.getQueriesData({
				queryKey: CSO_INFO_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((CsoInfoData) =>
							CsoInfoData.cso_id === updatedCsoInfo.data.cso_id
								? { ...CsoInfoData, ...updatedCsoInfo.data }
								: CsoInfoData
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.cso_id !== parseInt(id)),
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

		onSuccess: (deletedData) => {
			const queries = queryClient.getQueriesData({
				queryKey: CSO_INFO_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(CsoInfoData) =>
								CsoInfoData.cso_id !== parseInt(deletedData.deleted_id)
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
