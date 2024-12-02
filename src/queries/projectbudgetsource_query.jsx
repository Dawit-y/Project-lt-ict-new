import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetSource,
  updateProjectBudgetSource,
  addProjectBudgetSource,
  deleteProjectBudgetSource,
} from "../helpers/projectbudgetsource_backend_helper";

const PROJECT_BUDGET_SOURCE_QUERY_KEY = ["projectbudgetsource"];

// Fetch project_budget_source
export const useFetchProjectBudgetSources = () => {
  return useQuery({
    queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
    queryFn: () => getProjectBudgetSource(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_budget_source
export const useSearchProjectBudgetSources = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( PROJECT_BUDGET_SOURCE_QUERY_KEY, (oldData) => {
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

// Update project_budget_source
export const useUpdateProjectBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetSource,
    onSuccess: (updatedProjectBudgetSource) => {
      queryClient.setQueryData(PROJECT_BUDGET_SOURCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectBudgetSourceData) =>
            ProjectBudgetSourceData.bsr_id === updatedProjectBudgetSource.data.bsr_id
              ? { ...ProjectBudgetSourceData, ...updatedProjectBudgetSource.data }
              : ProjectBudgetSourceData
          ),
        };
      });
    },
  });
};

// Delete project_budget_source
export const useDeleteProjectBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetSource,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_BUDGET_SOURCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectBudgetSourceData) => ProjectBudgetSourceData.bsr_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
