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

			const tempId = Date.now();
			const optimisticData = { ...newData, psc_id: tempId };

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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psc_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psc_id === updatedData.psc_id ? { ...d, ...updatedData } : d
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.psc_id === serverData.psc_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.psc_id !== parseInt(id)),
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
				queryKey: SECTOR_CATEGORY_QUERY_KEY,
			});
		},
	});
};
