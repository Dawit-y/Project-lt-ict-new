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

			const tempId = Date.now();
			const optimisticData = { ...newData, pri_id: tempId };

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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pri_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pri_id === updatedData.pri_id ? { ...d, ...updatedData } : d
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pri_id === serverData.pri_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pri_id !== parseInt(id)),
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
				queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
			});
		},
	});
};
