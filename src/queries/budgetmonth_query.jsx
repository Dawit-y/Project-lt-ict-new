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
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( BUDGET_MONTH_QUERY_KEY, (oldData) => {
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

// Update budget_month
export const useUpdateBudgetMonth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetMonth,
    onSuccess: (updatedBudgetMonth) => {
      queryClient.setQueryData(BUDGET_MONTH_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((BudgetMonthData) =>
            BudgetMonthData.bdm_id === updatedBudgetMonth.data.bdm_id
              ? { ...BudgetMonthData, ...updatedBudgetMonth.data }
              : BudgetMonthData
          ),
        };
      });
    },
  });
};

// Delete budget_month
export const useDeleteBudgetMonth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetMonth,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(BUDGET_MONTH_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (BudgetMonthData) => BudgetMonthData.bdm_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
