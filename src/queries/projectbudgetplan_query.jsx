import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetPlan,
  updateProjectBudgetPlan,
  addProjectBudgetPlan,
  deleteProjectBudgetPlan,
} from "../helpers/projectbudgetplan_backend_helper";

const PROJECT_BUDGET_PLAN_QUERY_KEY = ["projectbudgetplan"];

// Fetch project_budget_plan
export const useFetchProjectBudgetPlans = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_PLAN_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectBudgetPlan(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_budget_plan
export const useSearchProjectBudgetPlans = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_PLAN_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectBudgetPlan(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add project_budget_plan
export const useAddProjectBudgetPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectBudgetPlan,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(PROJECT_BUDGET_PLAN_QUERY_KEY, (oldData) => {
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

// Update project_budget_plan
export const useUpdateProjectBudgetPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectBudgetPlan,
    onSuccess: (updatedProjectBudgetPlan) => {
      queryClient.setQueryData(PROJECT_BUDGET_PLAN_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectBudgetPlanData) =>
            ProjectBudgetPlanData.bpl_id ===
              updatedProjectBudgetPlan.data.bpl_id
              ? { ...ProjectBudgetPlanData, ...updatedProjectBudgetPlan.data }
              : ProjectBudgetPlanData
          ),
        };
      });
    },
  });
};

// Delete project_budget_plan
export const useDeleteProjectBudgetPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectBudgetPlan,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_BUDGET_PLAN_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectBudgetPlanData) =>
              ProjectBudgetPlanData.bpl_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
