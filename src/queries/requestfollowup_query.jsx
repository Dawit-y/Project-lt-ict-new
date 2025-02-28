import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequestFollowup,
  updateRequestFollowup,
  addRequestFollowup,
  deleteRequestFollowup,
} from "../helpers/requestfollowup_backend_helper";

const REQUEST_FOLLOWUP_QUERY_KEY = ["requestfollowup"];

// Fetch request_followup
export const useFetchRequestFollowups = () => {
  return useQuery({
    queryKey: REQUEST_FOLLOWUP_QUERY_KEY,
    queryFn: () => getRequestFollowup(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search request_followup
export const useSearchRequestFollowups = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REQUEST_FOLLOWUP_QUERY_KEY, searchParams],
    queryFn: () => getRequestFollowup(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add request_followup
export const useAddRequestFollowup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestFollowup,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( REQUEST_FOLLOWUP_QUERY_KEY, (oldData) => {
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
// Update request_followup
export const useUpdateRequestFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestFollowup,
    onSuccess: (updatedRequestFollowup) => {
      queryClient.setQueryData(REQUEST_FOLLOWUP_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((RequestFollowupData) =>
            RequestFollowupData.rqf_id === updatedRequestFollowup.data.rqf_id
              ? { ...RequestFollowupData, ...updatedRequestFollowup.data }
              : RequestFollowupData
          ),
        };
      });
    },
  });
};
// Delete request_followup
export const useDeleteRequestFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRequestFollowup,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(REQUEST_FOLLOWUP_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (RequestFollowupData) => RequestFollowupData.rqf_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
