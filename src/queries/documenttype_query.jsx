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

			const tempId = Date.now();
			const optimisticData = { ...newData, pdt_id: tempId };

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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pdt_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pdt_id === updatedData.pdt_id ? { ...d, ...updatedData } : d
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pdt_id === serverData.pdt_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pdt_id !== parseInt(id)),
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
				queryKey: DOCUMENT_TYPE_QUERY_KEY,
			});
		},
	});
};
