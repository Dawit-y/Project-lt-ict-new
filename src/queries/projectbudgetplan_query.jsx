import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetPlan,
  updateProjectBudgetPlan,
  addProjectBudgetPlan,
  deleteProjectBudgetPlan,
} from "../helpers/projectbudgetplan_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
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
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
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
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_budget_plan
export const useUpdateProjectBudgetPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectBudgetPlan,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bpl_id === updatedData.bpl_id ? { ...d, ...updatedData } : d,
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

    onSuccess: (updatedProjectBudgetPlan) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((ProjectBudgetPlanData) =>
              ProjectBudgetPlanData.bpl_id ===
                updatedProjectBudgetPlan.data.bpl_id
                ? { ...ProjectBudgetPlanData, ...updatedProjectBudgetPlan.data }
                : ProjectBudgetPlanData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_budget_plan
export const useDeleteProjectBudgetPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectBudgetPlan,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ProjectBudgetPlanData) =>
                ProjectBudgetPlanData.bpl_id !== parseInt(id),
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

    onSuccess: (deletedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ProjectBudgetPlanData) =>
                ProjectBudgetPlanData.bpl_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_BUDGET_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
