import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMonitoringEvaluationType,
  updateMonitoringEvaluationType,
  addMonitoringEvaluationType,
  deleteMonitoringEvaluationType,
} from "../helpers/monitoringevaluationtype_backend_helper";

const MONITORING_EVALUATION_TYPE_QUERY_KEY = ["monitoringevaluationtype"];
// Fetch monitoring_evaluation_type
export const useFetchMonitoringEvaluationTypes = () => {
  return useQuery({
    queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
    queryFn: () => getMonitoringEvaluationType(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search monitoring_evaluation_type
export const useSearchMonitoringEvaluationTypes = (searchParams = {}) => {
  return useQuery({
    queryKey: [...MONITORING_EVALUATION_TYPE_QUERY_KEY, searchParams],
    queryFn: () => getMonitoringEvaluationType(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add monitoring_evaluation_type
export const useAddMonitoringEvaluationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMonitoringEvaluationType,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
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
// Update monitoring_evaluation_type
export const useUpdateMonitoringEvaluationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMonitoringEvaluationType,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.met_id === updatedData.data.met_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete monitoring_evaluation_type
export const useDeleteMonitoringEvaluationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMonitoringEvaluationType,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: MONITORING_EVALUATION_TYPE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) => deletedData.met_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
