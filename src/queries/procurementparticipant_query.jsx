import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcurementParticipant,
  updateProcurementParticipant,
  addProcurementParticipant,
  deleteProcurementParticipant,
} from "../helpers/procurementparticipant_backend_helper";

const PROCUREMENT_PARTICIPANT_QUERY_KEY = ["procurementparticipant"];
// Fetch procurement_participant
export const useFetchProcurementParticipants = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROCUREMENT_PARTICIPANT_QUERY_KEY, param],
    queryFn: () => getProcurementParticipant(param),
    staleTime: 1000 * 60 * 1,
    meta: { persist: false },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search procurement_participant
export const useSearchProcurementParticipants = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROCUREMENT_PARTICIPANT_QUERY_KEY, searchParams],
    queryFn: () => getProcurementParticipant(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add procurement_participant
export const useAddProcurementParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProcurementParticipant,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
      });

      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

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
// Update procurement_participant
export const useUpdateProcurementParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcurementParticipant,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.ppp_id === updatedData.data.ppp_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },
  });
};
// Delete procurement_participant
export const useDeleteProcurementParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcurementParticipant,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_PARTICIPANT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.ppp_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },
  });
};
