import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectMonitoringEvaluation,
  updateProjectMonitoringEvaluation,
  addProjectMonitoringEvaluation,
  deleteProjectMonitoringEvaluation,
} from "../helpers/projectmonitoringevaluation_backend_helper";

const PROJECT_MONITORING_EVALUATION_QUERY_KEY = ["projectmonitoringevaluation"];
// Fetch project_monitoring_evaluation
export const useFetchProjectMonitoringEvaluations = (param, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_MONITORING_EVALUATION_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectMonitoringEvaluation(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive
  });
};

//search project_monitoring_evaluation
export const useSearchProjectMonitoringEvaluations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_MONITORING_EVALUATION_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectMonitoringEvaluation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add project_monitoring_evaluation
export const useAddProjectMonitoringEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectMonitoringEvaluation,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
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
// Update project_monitoring_evaluation
export const useUpdateProjectMonitoringEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectMonitoringEvaluation,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.mne_id === updatedData.data.mne_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete project_monitoring_evaluation
export const useDeleteProjectMonitoringEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectMonitoringEvaluation,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) => deletedData.mne_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
