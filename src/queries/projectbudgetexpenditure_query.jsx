import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetExpenditure,
  updateProjectBudgetExpenditure,
  addProjectBudgetExpenditure,
  deleteProjectBudgetExpenditure,
} from "../helpers/projectbudgetexpenditure_backend_helper";

const PROJECT_BUDGET_EXPENDITURE_QUERY_KEY = ["projectbudgetexpenditure"];

// Fetch project_budget_expenditure
export const useFetchProjectBudgetExpenditures = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectBudgetExpenditure(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_budget_expenditure
export const useSearchProjectBudgetExpenditures = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_EXPENDITURE_QUERY_KEY, "search", searchParams],
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
      queryClient.invalidateQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);
    },
  });
};

// Update project_budget_expenditure
export const useUpdateProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetExpenditure,
    onSuccess: (updatedProjectBudgetExpenditure) => {
      queryClient.invalidateQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);
    },
  });
};

// Delete project_budget_expenditure
export const useDeleteProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetExpenditure,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_BUDGET_EXPENDITURE_QUERY_KEY);
    },
  });
};
