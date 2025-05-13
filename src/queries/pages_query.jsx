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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(PAGES_QUERY_KEY, (oldData) => {
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

// Update pages
export const useUpdatePages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePages,
    onSuccess: (updatedPages) => {
      queryClient.setQueryData(PAGES_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((PagesData) =>
            PagesData.pag_id === updatedPages.data.pag_id
              ? { ...PagesData, ...updatedPages.data }
              : PagesData
          ),
        };
      });
    },
  });
};

// Delete pages
export const useDeletePages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePages,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PAGES_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (PagesData) => PagesData.pag_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
