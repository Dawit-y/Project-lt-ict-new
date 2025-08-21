import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetSource,
  updateProjectBudgetSource,
  addProjectBudgetSource,
  deleteProjectBudgetSource,
} from "../helpers/projectbudgetsource_backend_helper";

const PROJECT_BUDGET_SOURCE_QUERY_KEY = ["projectbudgetsource"];

// Fetch project_budget_source
export const useFetchProjectBudgetSources = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectBudgetSource(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_budget_source
export const useSearchProjectBudgetSources = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectBudgetSource(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_budget_source
export const useAddProjectBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectBudgetSource,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
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

// Update project_budget_source
export const useUpdateProjectBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetSource,
    onSuccess: (updatedProjectBudgetSource) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.bsr_id === updatedProjectBudgetSource.data.bsr_id
                ? { ...data, ...updatedProjectBudgetSource.data }
                : data,
            ),
          };
        });
      });
    },
  });
};

// Delete project_budget_source
export const useDeleteProjectBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetSource,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (projectBSource) => projectBSource.bsr_id !== parseInt(variable),
            ),
          };
        });
      });
    },
  });
};
