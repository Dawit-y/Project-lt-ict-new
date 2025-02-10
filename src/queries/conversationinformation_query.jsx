import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversationInformation,
  updateConversationInformation,
  addConversationInformation,
  deleteConversationInformation,
} from "../helpers/conversationinformation_backend_helper";

const CONVERSATION_INFORMATION_QUERY_KEY = ["conversationinformation"];

// Fetch conversation_information
export const useFetchConversationInformations = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...CONVERSATION_INFORMATION_QUERY_KEY, "fetch", param],
    queryFn: () => getConversationInformation(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive
  });
};

//search conversation_information
export const useSearchConversationInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...CONVERSATION_INFORMATION_QUERY_KEY, "search", searchParams],
    queryFn: () => getConversationInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add conversation_information
export const useAddConversationInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addConversationInformation,
    onSuccess: (newDataResponse) => {
      // Get all queries matching the CONVERSATION_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
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

// Update conversation_information
export const useUpdateConversationInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConversationInformation,
    onSuccess: (updatedConversationInformation) => {
      // Get all queries matching the CONVERSATION_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((ConversationInformationData) =>
              ConversationInformationData.cvi_id ===
                updatedConversationInformation.data.cvi_id
                ? { ...ConversationInformationData, ...updatedConversationInformation.data }
                : ConversationInformationData
            ),
          };
        });
      });
    },
  });
};

// Delete conversation_information
export const useDeleteConversationInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversationInformation,
    onSuccess: (deletedData) => {
      // Get all queries matching the CONVERSATION_INFORMATION_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ConversationInformationData) =>
                ConversationInformationData.cvi_id !==
                parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};