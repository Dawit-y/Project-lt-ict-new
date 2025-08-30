import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectMonitoringEvaluation,
  updateProjectMonitoringEvaluation,
  addProjectMonitoringEvaluation,
  deleteProjectMonitoringEvaluation,
} from "../helpers/projectmonitoringevaluation_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_MONITORING_EVALUATION_QUERY_KEY = ["projectmonitoringevaluation"];
// Fetch project_monitoring_evaluation
export const useFetchProjectMonitoringEvaluations = (param, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_MONITORING_EVALUATION_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectMonitoringEvaluation(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_monitoring_evaluation
export const useSearchProjectMonitoringEvaluations = (searchParams = {}) => {
  return useQuery({
    queryKey: [
      ...PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      "search",
      searchParams,
    ],
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_MONITORING_EVALUATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
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
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Update project_monitoring_evaluation
export const useUpdateProjectMonitoringEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectMonitoringEvaluation,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_MONITORING_EVALUATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.mne_id === updatedData.data.mne_id ? { ...d, ...updatedData.data } : d,
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
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Delete project_monitoring_evaluation
export const useDeleteProjectMonitoringEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectMonitoringEvaluation,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_MONITORING_EVALUATION_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.mne_id !== parseInt(id),
            ),
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
              (deletedData) =>
                deletedData.mne_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_MONITORING_EVALUATION_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
