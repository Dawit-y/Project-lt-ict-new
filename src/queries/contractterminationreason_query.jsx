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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(
        CONTRACT_TERMINATION_REASON_QUERY_KEY,
        (oldData) => {
          if (!oldData) return;
          const newData = {
            ...newDataResponse.data,
            ...newDataResponse.previledge,
          };
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        },
      );
    },
  });
};

// Update contract_termination_reason
export const useUpdateContractTerminationReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContractTerminationReason,
    onSuccess: (updatedContractTerminationReason) => {
      queryClient.setQueryData(
        CONTRACT_TERMINATION_REASON_QUERY_KEY,
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            data: oldData.data.map((ContractTerminationReasonData) =>
              ContractTerminationReasonData.ctr_id ===
              updatedContractTerminationReason.data.ctr_id
                ? {
                    ...ContractTerminationReasonData,
                    ...updatedContractTerminationReason.data,
                  }
                : ContractTerminationReasonData,
            ),
          };
        },
      );
    },
  });
};

// Delete contract_termination_reason
export const useDeleteContractTerminationReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContractTerminationReason,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(
        CONTRACT_TERMINATION_REASON_QUERY_KEY,
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ContractTerminationReasonData) =>
                ContractTerminationReasonData.ctr_id !==
                parseInt(deletedData.deleted_id),
            ),
          };
        },
      );
    },
  });
};
