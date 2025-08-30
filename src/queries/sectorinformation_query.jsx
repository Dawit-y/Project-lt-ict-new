import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getSectorInformation,
	updateSectorInformation,
	addSectorInformation,
	deleteSectorInformation,
} from "../helpers/sectorinformation_backend_helper";

const SECTOR_INFORMATION_QUERY_KEY = ["sectorinformation"];

// Fetch sector_information
export const useFetchSectorInformations = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...SECTOR_INFORMATION_QUERY_KEY, "fetch", param],
		queryFn: () => getSectorInformation(param),
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 11,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

// Search sector_information
export const useSearchSectorInformations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...SECTOR_INFORMATION_QUERY_KEY, "search", searchParams],
		queryFn: () => getSectorInformation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

// Add sector_information
export const useAddSectorInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addSectorInformation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(SECTOR_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
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
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
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
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Update sector_information
export const useUpdateSectorInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSectorInformation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(SECTOR_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.sci_id === updatedData.data.sci_id
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
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.sci_id === updatedData.data.sci_id
								? { ...d, ...updatedData.data }
								: d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Delete sector_information
export const useDeleteSectorInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSectorInformation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(SECTOR_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.sci_id !== parseInt(id)),
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
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.sci_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SECTOR_INFORMATION_QUERY_KEY,
			});
		},
	});
};
