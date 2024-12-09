import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPerformance,
  updateProjectPerformance,
  addProjectPerformance,
  deleteProjectPerformance,
} from "../helpers/projectperformance_backend_helper";

const PROJECT_PERFORMANCE_QUERY_KEY = ["projectperformance"];

// Fetch project_performance
export const useFetchProjectPerformances = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PERFORMANCE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectPerformance(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
      queryClient.invalidateQueries(PROJECT_PERFORMANCE_QUERY_KEY);
    },
  });
};

// Update project_performance
export const useUpdateProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPerformance,
    onSuccess: (updatedProjectPerformance) => {
      queryClient.invalidateQueries(PROJECT_PERFORMANCE_QUERY_KEY);
    },
  });
};

// Delete project_performance
export const useDeleteProjectPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPerformance,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_PERFORMANCE_QUERY_KEY);
    },
  });
};
