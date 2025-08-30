import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getSectorCategory,
	updateSectorCategory,
	addSectorCategory,
	deleteSectorCategory,
} from "../helpers/sectorcategory_backend_helper";

const SECTOR_CATEGORY_QUERY_KEY = ["sectorcategory"];

// Fetch sector_category
export const useFetchSectorCategorys = () => {
	return useQuery({
		queryKey: SECTOR_CATEGORY_QUERY_KEY,
		queryFn: () => getSectorCategory(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search sector_category
export const useSearchSectorCategorys = (searchParams = {}) => {
	return useQuery({
		queryKey: [...SECTOR_CATEGORY_QUERY_KEY, searchParams],
		queryFn: () => getSectorCategory(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add sector_category
export const useAddSectorCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addSectorCategory,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(SECTOR_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});
		},
	});
};

// Update sector_category
export const useUpdateSectorCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSectorCategory,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(SECTOR_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psc_id === updatedData.data.psc_id
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.psc_id === updatedData.data.psc_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});
		},
	});
};

// Delete sector_category
export const useDeleteSectorCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSectorCategory,

		onMutate: async (id) => {
			await queryClient.cancelQueries(SECTOR_CATEGORY_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.psc_id !== parseInt(id)),
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.psc_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});
		},
	});
};
