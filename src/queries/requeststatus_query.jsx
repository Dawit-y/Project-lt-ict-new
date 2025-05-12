import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequestStatus,
  updateRequestStatus,
  addRequestStatus,
  deleteRequestStatus,
} from "../helpers/requeststatus_backend_helper";

const REQUEST_STATUS_QUERY_KEY = ["requeststatus"];

// Fetch request_status
export const useFetchRequestStatuss = () => {
  return useQuery({
    queryKey: REQUEST_STATUS_QUERY_KEY,
    queryFn: () => getRequestStatus(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search request_status
export const useSearchRequestStatuss = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REQUEST_STATUS_QUERY_KEY, searchParams],
    queryFn: () => getRequestStatus(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add request_status
export const useAddRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestStatus,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( REQUEST_STATUS_QUERY_KEY, (oldData) => {
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

// Update request_status
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: (updatedRequestStatus) => {
      queryClient.setQueryData(REQUEST_STATUS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((RequestStatusData) =>
            RequestStatusData.rqs_id === updatedRequestStatus.data.rqs_id
              ? { ...RequestStatusData, ...updatedRequestStatus.data }
              : RequestStatusData
          ),
        };
      });
    },
  });
};

// Delete request_status
export const useDeleteRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRequestStatus,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(REQUEST_STATUS_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (RequestStatusData) => RequestStatusData.rqs_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
