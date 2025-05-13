import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcurementStage,
  updateProcurementStage,
  addProcurementStage,
  deleteProcurementStage,
} from "../helpers/procurementstage_backend_helper";

const PROCUREMENT_STAGE_QUERY_KEY = ["procurementstage"];
// Fetch procurement_stage
export const useFetchProcurementStages = () => {
  return useQuery({
    queryKey: PROCUREMENT_STAGE_QUERY_KEY,
    queryFn: () => getProcurementStage(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search procurement_stage
export const useSearchProcurementStages = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROCUREMENT_STAGE_QUERY_KEY, searchParams],
    queryFn: () => getProcurementStage(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};
// Add procurement_stage
export const useAddProcurementStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProcurementStage,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_STAGE_QUERY_KEY,
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
// Update procurement_stage
export const useUpdateProcurementStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcurementStage,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_STAGE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.pst_id === updatedData.data.pst_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete procurement_stage
export const useDeleteProcurementStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcurementStage,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_STAGE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) => deletedData.pst_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
