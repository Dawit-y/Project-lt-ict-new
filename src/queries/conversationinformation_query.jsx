import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversationInformation,
  updateConversationInformation,
  addConversationInformation,
  deleteConversationInformation,
} from "../helpers/conversationinformation_backend_helper";

const CONVERSATION_INFORMATION_QUERY_KEY = ["conversationinformation"];

// Fetch conversation_information
export const useFetchConversationInformations = () => {
  return useQuery({
    queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
    queryFn: () => getConversationInformation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search conversation_information
export const useSearchConversationInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...CONVERSATION_INFORMATION_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( CONVERSATION_INFORMATION_QUERY_KEY, (oldData) => {
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

// Update conversation_information
export const useUpdateConversationInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateConversationInformation,
    onSuccess: (updatedConversationInformation) => {
      queryClient.setQueryData(CONVERSATION_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ConversationInformationData) =>
            ConversationInformationData.cvi_id === updatedConversationInformation.data.cvi_id
              ? { ...ConversationInformationData, ...updatedConversationInformation.data }
              : ConversationInformationData
          ),
        };
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
      queryClient.setQueryData(CONVERSATION_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ConversationInformationData) => ConversationInformationData.cvi_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
