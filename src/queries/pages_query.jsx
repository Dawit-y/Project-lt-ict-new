import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPages,
	updatePages,
	addPages,
	deletePages,
} from "../helpers/pages_backend_helper";

const PAGES_QUERY_KEY = ["pages"];

// Fetch pages
export const useFetchPagess = () => {
	return useQuery({
		queryKey: PAGES_QUERY_KEY,
		queryFn: () => getPages(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search pages
export const useSearchPagess = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PAGES_QUERY_KEY, searchParams],
		queryFn: () => getPages(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add pages
export const useAddPages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addPages,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PAGES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAGES_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pag_id: tempId };

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
				queryKey: PAGES_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pag_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PAGES_QUERY_KEY,
			});
		},
	});
};

// Update pages
export const useUpdatePages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePages,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PAGES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAGES_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pag_id === updatedData.pag_id ? { ...d, ...updatedData } : d
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
				queryKey: PAGES_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pag_id === serverData.pag_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PAGES_QUERY_KEY,
			});
		},
	});
};

// Delete pages
export const useDeletePages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePages,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PAGES_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PAGES_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pag_id !== parseInt(id)),
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
				queryKey: PAGES_QUERY_KEY,
			});
		},
	});
};
