import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPerformance,
  updateProjectPerformance,
  addProjectPerformance,
  deleteProjectPerformance,
} from "../helpers/projectperformance_backend_helper";

const PROJECT_PERFORMANCE_QUERY_KEY = ["projectperformance"];

// Fetch project_performance
export const useFetchProjectPerformances = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectPerformance(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search project_performance
export const useSearchProjectPerformances = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectPerformance(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_performance
export const useAddProjectPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectPerformance,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
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

// Update project_performance
export const useUpdateProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPerformance,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prp_id === updatedData.data.prp_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_performance
export const useDeleteProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPerformance,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prp_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
