import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetExpenditure,
  updateProjectBudgetExpenditure,
  addProjectBudgetExpenditure,
  deleteProjectBudgetExpenditure,
} from "../helpers/projectbudgetexpenditure_backend_helper";

const PROJECT_BUDGET_EXPENDITURE_QUERY_KEY = ["projectbudgetexpenditure"];

// Fetch project_budget_expenditure
export const useFetchProjectBudgetExpenditures = () => {
  return useQuery({
    queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
    queryFn: () => getProjectBudgetExpenditure(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_budget_expenditure
export const useSearchProjectBudgetExpenditures = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, searchParams],
    queryFn: () => getProjectBudgetExpenditure(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_budget_expenditure
export const useAddProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectBudgetExpenditure,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, (oldData) => {
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

// Update project_budget_expenditure
export const useUpdateProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetExpenditure,
    onSuccess: (updatedProjectBudgetExpenditure) => {
      queryClient.setQueryData(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectBudgetExpenditureData) =>
            ProjectBudgetExpenditureData.pbe_id === updatedProjectBudgetExpenditure.data.pbe_id
              ? { ...ProjectBudgetExpenditureData, ...updatedProjectBudgetExpenditure.data }
              : ProjectBudgetExpenditureData
          ),
        };
      });
    },
  });
};

// Delete project_budget_expenditure
export const useDeleteProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetExpenditure,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectBudgetExpenditureData) => ProjectBudgetExpenditureData.pbe_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
