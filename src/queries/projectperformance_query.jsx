import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPerformance,
  updateProjectPerformance,
  addProjectPerformance,
  deleteProjectPerformance,
} from "../helpers/projectperformance_backend_helper";

const PROJECT_PERFORMANCE_QUERY_KEY = ["projectperformance"];

// Fetch project_performance
export const useFetchProjectPerformances = () => {
  return useQuery({
    queryKey: PROJECT_PERFORMANCE_QUERY_KEY,
    queryFn: () => getProjectPerformance(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_performance
export const useSearchProjectPerformances = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( PROJECT_PERFORMANCE_QUERY_KEY, (oldData) => {
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

// Update project_performance
export const useUpdateProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPerformance,
    onSuccess: (updatedProjectPerformance) => {
      queryClient.setQueryData(PROJECT_PERFORMANCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectPerformanceData) =>
            ProjectPerformanceData.prp_id === updatedProjectPerformance.data.prp_id
              ? { ...ProjectPerformanceData, ...updatedProjectPerformance.data }
              : ProjectPerformanceData
          ),
        };
      });
    },
  });
};

// Delete project_performance
export const useDeleteProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPerformance,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_PERFORMANCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectPerformanceData) => ProjectPerformanceData.prp_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
