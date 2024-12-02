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
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add document_type
export const useAddDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDocumentType,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( DOCUMENT_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        const newData = {
          ...newDataResponse.data,
          ...newDataResponse.previledge,
        };
        return {
          ...oldData,
          data: [newData, ...oldData.data],
        };
      });
    },
  });
};

// Update document_type
export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocumentType,
    onSuccess: (updatedDocumentType) => {
      queryClient.setQueryData(DOCUMENT_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((DocumentTypeData) =>
            DocumentTypeData.pdt_id === updatedDocumentType.data.pdt_id
              ? { ...DocumentTypeData, ...updatedDocumentType.data }
              : DocumentTypeData
          ),
        };
      });
    },
  });
};

// Delete document_type
export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocumentType,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(DOCUMENT_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (DocumentTypeData) => DocumentTypeData.pdt_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
