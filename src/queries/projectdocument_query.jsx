import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectDocument,
	updateProjectDocument,
	addProjectDocument,
	deleteProjectDocument,
} from "../helpers/projectdocument_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_DOCUMENT_QUERY_KEY = ["project_document"];

// Fetch project_documents
export const useFetchProjectDocuments = (param, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_DOCUMENT_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectDocument(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};
const createQueryKey = (searchParams) => {
	if (!searchParams) {
		return [...PROJECT_DOCUMENT_QUERY_KEY, "search"];
	}
	const serializedParams = JSON.stringify(searchParams);
	return [...PROJECT_DOCUMENT_QUERY_KEY, "search", serializedParams];
};

// Search project documents
export const useSearchProjectDocuments = (
	searchParams = null,
	isActive = false
) => {
	return useQuery({
		queryKey: [...PROJECT_DOCUMENT_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectDocument(searchParams),
		enabled: !!searchParams && isActive,
		staleTime: 1000 * 60 * 2,
		cacheTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};
// Add project_documents
export const useAddProjectDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectDocument,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_DOCUMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prd_id: tempId };

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
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prd_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_Document
export const useUpdateProjectDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectDocument,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_DOCUMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prd_id === updatedData.prd_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prd_id === serverData.prd_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_Document
export const useDeleteProjectDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectDocument,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_DOCUMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prd_id !== parseInt(id)),
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
				queryKey: PROJECT_DOCUMENT_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
