import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectDocument,
  updateProjectDocument,
  addProjectDocument,
  deleteProjectDocument,
} from "../helpers/projectdocument_backend_helper";

const PROJECT_DOCUMENT_QUERY_KEY = ["project_document"];

// Fetch project_employee
export const useFetchProjectDocuments = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_DOCUMENT_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectDocument(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search project_employee
export const useSearchProjectDocuments = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_DOCUMENT_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectDocument(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_employee
export const useAddProjectDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectDocument,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_DOCUMENT_QUERY_KEY,
      });

      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        });
      });
    },
  });
};

// Update project_Document
export const useUpdateProjectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectDocument,
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
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_Document
export const useDeleteProjectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectDocument,
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
              (dept) => dept.prd_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
