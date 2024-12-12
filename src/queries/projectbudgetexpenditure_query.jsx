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

export const useAddProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectBudgetExpenditure,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
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

// Update project_budget_expenditure
export const useUpdateProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetExpenditure,
    onSuccess: (updatedProjectBudgetExpenditure) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.pbe_id === updatedProjectBudgetExpenditure.data.pbe_id
                ? { ...data, ...updatedProjectBudgetExpenditure.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_budget_expenditure
export const useDeleteProjectBudgetExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetExpenditure,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_EXPENDITURE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.pbe_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
