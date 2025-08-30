import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetMonth,
  updateBudgetMonth,
  addBudgetMonth,
  deleteBudgetMonth,
} from "../helpers/budgetmonth_backend_helper";

const BUDGET_MONTH_QUERY_KEY = ["budgetmonth"];

// Fetch budget_month
export const useFetchBudgetMonths = () => {
  return useQuery({
    queryKey: BUDGET_MONTH_QUERY_KEY,
    queryFn: () => getBudgetMonth(),
    staleTime: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search budget_month
export const useSearchBudgetMonths = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_MONTH_QUERY_KEY, searchParams],
    queryFn: () => getBudgetMonth(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add budget_month
export const useAddBudgetMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetMonth,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_MONTH_QUERY_KEY,
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
        queryKey: BUDGET_MONTH_QUERY_KEY,
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
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });
    },
  });
};

// Update budget_month
export const useUpdateBudgetMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetMonth,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bdm_id === updatedData.data.bdm_id ? { ...d, ...updatedData.data } : d,
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

    onSuccess: (updatedBudgetMonth) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((BudgetMonthData) =>
              BudgetMonthData.bdm_id === updatedBudgetMonth.data.bdm_id
                ? { ...BudgetMonthData, ...updatedBudgetMonth.data }
                : BudgetMonthData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });
    },
  });
};

// Delete budget_month
export const useDeleteBudgetMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetMonth,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_MONTH_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetMonthData) =>
                BudgetMonthData.bdm_id !== parseInt(id),
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
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetMonthData) =>
                BudgetMonthData.bdm_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_MONTH_QUERY_KEY,
      });
    },
  });
};
