import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDocumentType,
	updateDocumentType,
	addDocumentType,
	deleteDocumentType,
} from "../helpers/documenttype_backend_helper";

const DOCUMENT_TYPE_QUERY_KEY = ["documenttype"];

// Fetch document_type
export const useFetchDocumentTypes = () => {
	return useQuery({
		queryKey: DOCUMENT_TYPE_QUERY_KEY,
		queryFn: () => getDocumentType(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search document_type
export const useSearchDocumentTypes = (searchParams = {}) => {
	return useQuery({
		queryKey: [...DOCUMENT_TYPE_QUERY_KEY, searchParams],
		queryFn: () => getDocumentType(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add document_type
export const useAddDocumentType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addDocumentType,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(DOCUMENT_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});
		},
	});
};

// Update document_type
export const useUpdateDocumentType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateDocumentType,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(DOCUMENT_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pdt_id === updatedData.data.pdt_id
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pdt_id === updatedData.data.pdt_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});
		},
	});
};

// Delete document_type
export const useDeleteDocumentType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDocumentType,

		onMutate: async (id) => {
			await queryClient.cancelQueries(DOCUMENT_TYPE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pdt_id !== parseInt(id)),
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pdt_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});
		},
	});
};
