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
				queryKey: PAGES_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pag_id === updatedData.data.pag_id
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
				queryKey: PAGES_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pag_id === updatedData.data.pag_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pag_id !== parseInt(id)),
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
				queryKey: PAGES_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pag_id !== parseInt(variable)),
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
