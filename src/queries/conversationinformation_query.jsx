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
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(CONVERSATION_INFORMATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data], // optimistic insert
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _newData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (newDataResponse) => {
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });
    },
  });
};

// Update conversation_information
export const useUpdateConversationInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConversationInformation,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(CONVERSATION_INFORMATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.cvi_id === updatedData.data.cvi_id
                ? { ...d, ...updatedData.data }
                : d
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _updatedData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.cvi_id === updatedData.data.cvi_id
                ? { ...d, ...updatedData.data }
                : d
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });
    },
  });
};

// Delete conversation_information
export const useDeleteConversationInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversationInformation,

    onMutate: async (id) => {
      await queryClient.cancelQueries(CONVERSATION_INFORMATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter((d) => d.cvi_id !== parseInt(id)),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (_deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter((d) => d.cvi_id !== parseInt(variable)),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_INFORMATION_QUERY_KEY,
      });
    },
  });
};
