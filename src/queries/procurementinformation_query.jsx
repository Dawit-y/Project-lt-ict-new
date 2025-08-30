import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProcurementInformation,
	updateProcurementInformation,
	addProcurementInformation,
	deleteProcurementInformation,
} from "../helpers/procurementinformation_backend_helper";

const PROCUREMENT_INFORMATION_QUERY_KEY = ["procurementinformation"];

export const useFetchProcurementInformations = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROCUREMENT_INFORMATION_QUERY_KEY, "fetch", param],
		queryFn: () => getProcurementInformation(param),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		meta: { persist: false },
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: isActive,
	});
};
//search procurement_information
export const useSearchProcurementInformations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROCUREMENT_INFORMATION_QUERY_KEY, searchParams],
		queryFn: () => getProcurementInformation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add procurement_information
export const useAddProcurementInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProcurementInformation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROCUREMENT_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Update procurement_information
export const useUpdateProcurementInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProcurementInformation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROCUREMENT_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pri_id === updatedData.data.pri_id
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pri_id === updatedData.data.pri_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Delete procurement_information
export const useDeleteProcurementInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProcurementInformation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROCUREMENT_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pri_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pri_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});
		},
	});
};
