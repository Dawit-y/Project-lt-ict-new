import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequestInformation,
  updateRequestInformation,
  addRequestInformation,
  deleteRequestInformation,
} from "../helpers/requestinformation_backend_helper";

const REQUEST_INFORMATION_QUERY_KEY = ["requestinformation"];

// Fetch request_information
export const useFetchRequestInformations = () => {
  return useQuery({
    queryKey: REQUEST_INFORMATION_QUERY_KEY,
    queryFn: () => getRequestInformation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search request_information
export const useSearchRequestInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REQUEST_INFORMATION_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( REQUEST_INFORMATION_QUERY_KEY, (oldData) => {
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

// Update request_information
export const useUpdateRequestInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestInformation,
    onSuccess: (updatedRequestInformation) => {
      queryClient.setQueryData(REQUEST_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((RequestInformationData) =>
            RequestInformationData.rqi_id === updatedRequestInformation.data.rqi_id
              ? { ...RequestInformationData, ...updatedRequestInformation.data }
              : RequestInformationData
          ),
        };
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
      queryClient.setQueryData(REQUEST_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (RequestInformationData) => RequestInformationData.rqi_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
