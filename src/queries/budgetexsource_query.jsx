import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetExSource,
  updateBudgetExSource,
  addBudgetExSource,
  deleteBudgetExSource,
} from "../helpers/budgetexsource_backend_helper";

const BUDGET_EX_SOURCE_QUERY_KEY = ["budgetexsource"];

// Fetch budget_ex_source
export const useFetchBudgetExSources = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...BUDGET_EX_SOURCE_QUERY_KEY, "fetch", param],
    queryFn: () => getBudgetExSource(param),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    meta: { persist: false },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search budget_ex_source
export const useSearchBudgetExSources = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_EX_SOURCE_QUERY_KEY, searchParams],
    queryFn: () => getBudgetExSource(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add budget_ex_source
export const useAddBudgetExSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetExSource,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
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

// Update budget_ex_source
export const useUpdateBudgetExSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetExSource,
    onSuccess: (updatedBudgetExSource) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.bes_id === updatedBudgetExSource.data.bes_id
                ? { ...data, ...updatedBudgetExSource.data }
                : data,
            ),
          };
        });
      });
    },
  });
};

// Delete budget_ex_source
export const useDeleteBudgetExSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetExSource,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bes_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },
  });
};
