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
  isActive = false,
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
        queryKey: PROJECT_DOCUMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d,
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

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.prd_id === updatedData.data.prd_id ? { ...d, ...updatedData.data } : d,
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
        queryKey: PROJECT_DOCUMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prd_id === updatedData.data.prd_id
                ? { ...data, ...updatedData.data }
                : data,
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

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prd_id !== parseInt(id),
            ),
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
        queryKey: PROJECT_DOCUMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prd_id !== parseInt(variable),
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
