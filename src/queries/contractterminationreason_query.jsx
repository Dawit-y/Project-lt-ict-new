import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContractTerminationReason,
  updateContractTerminationReason,
  addContractTerminationReason,
  deleteContractTerminationReason,
} from "../helpers/contractterminationreason_backend_helper";

const CONTRACT_TERMINATION_REASON_QUERY_KEY = ["contractterminationreason"];

// Fetch contract_termination_reason
export const useFetchContractTerminationReasons = () => {
  return useQuery({
    queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
    queryFn: () => getContractTerminationReason(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search contract_termination_reason
export const useSearchContractTerminationReasons = (searchParams = {}) => {
  return useQuery({
    queryKey: [...CONTRACT_TERMINATION_REASON_QUERY_KEY, searchParams],
    queryFn: () => getContractTerminationReason(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add contract_termination_reason
export const useAddContractTerminationReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContractTerminationReason,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
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
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
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
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });
    },
  });
};

// Update contract_termination_reason
export const useUpdateContractTerminationReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContractTerminationReason,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.ctr_id === updatedData.data.ctr_id
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
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.ctr_id === updatedData.data.ctr_id
                ? { ...d, ...updatedData.data }
                : d
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });
    },
  });
};

// Delete contract_termination_reason
export const useDeleteContractTerminationReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContractTerminationReason,

    onMutate: async (id) => {
      await queryClient.cancelQueries(CONTRACT_TERMINATION_REASON_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter((d) => d.ctr_id !== parseInt(id)),
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
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });

      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (d) => d.ctr_id !== parseInt(variable)
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CONTRACT_TERMINATION_REASON_QUERY_KEY,
      });
    },
  });
};
