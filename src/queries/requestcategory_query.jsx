import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequestCategory,
  updateRequestCategory,
  addRequestCategory,
  deleteRequestCategory,
} from "../helpers/requestcategory_backend_helper";

const REQUEST_CATEGORY_QUERY_KEY = ["requestcategory"];

// Fetch request_category
export const useFetchRequestCategorys = () => {
  return useQuery({
    queryKey: REQUEST_CATEGORY_QUERY_KEY,
    queryFn: () => getRequestCategory(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search request_category
export const useSearchRequestCategorys = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REQUEST_CATEGORY_QUERY_KEY, searchParams],
    queryFn: () => getRequestCategory(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add request_category
export const useAddRequestCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestCategory,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( REQUEST_CATEGORY_QUERY_KEY, (oldData) => {
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

// Update request_category
export const useUpdateRequestCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestCategory,
    onSuccess: (updatedRequestCategory) => {
      queryClient.setQueryData(REQUEST_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((RequestCategoryData) =>
            RequestCategoryData.rqc_id === updatedRequestCategory.data.rqc_id
              ? { ...RequestCategoryData, ...updatedRequestCategory.data }
              : RequestCategoryData
          ),
        };
      });
    },
  });
};

// Delete request_category
export const useDeleteRequestCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRequestCategory,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(REQUEST_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (RequestCategoryData) => RequestCategoryData.rqc_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
