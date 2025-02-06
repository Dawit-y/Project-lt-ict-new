import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequestInformation,
  updateRequestInformation,
  addRequestInformation,
  deleteRequestInformation,
} from "../helpers/requestinformation_backend_helper";

const REQUEST_INFORMATION_QUERY_KEY = ["requestinformation"];

// Fetch request_information
export const useFetchRequestInformations = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...REQUEST_INFORMATION_QUERY_KEY, "fetch", param],
    queryFn: () => getRequestInformation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search request_information
export const useSearchRequestInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REQUEST_INFORMATION_QUERY_KEY, "search", searchParams],
    queryFn: () => getRequestInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add request_information
export const useAddRequestInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestInformation,
    onSuccess: (newDataResponse) => {
      // Get all queries matching the REQUEST_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: REQUEST_INFORMATION_QUERY_KEY,
      });

      // Prepare the new data to be added
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      // Update each query's cached data
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

// Update request_information
export const useUpdateRequestInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestInformation,
    onSuccess: (updatedRequestInformation) => {
      // Get all queries matching the REQUEST_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: REQUEST_INFORMATION_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((RequestInformationData) =>
              RequestInformationData.rqi_id ===
              updatedRequestInformation.data.rqi_id
                ? {
                    ...RequestInformationData,
                    ...updatedRequestInformation.data,
                  }
                : RequestInformationData
            ),
          };
        });
      });
    },
  });
};

// Delete request_information
export const useDeleteRequestInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRequestInformation,
    onSuccess: (deletedData) => {
      // Get all queries matching the REQUEST_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: REQUEST_INFORMATION_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (RequestInformationData) =>
                RequestInformationData.rqi_id !==
                parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
