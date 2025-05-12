import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  populateBudgetYear,
  getBudgetYear,
  updateBudgetYear,
  addBudgetYear,
  deleteBudgetYear,
} from "../helpers/budgetyear_backend_helper";

const BUDGET_YEAR_QUERY_KEY = ["budgetyear"];

// Fetch budget_year
export const useFetchBudgetYears = () => {
  return useQuery({
    queryKey: BUDGET_YEAR_QUERY_KEY,
    queryFn: () => getBudgetYear(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search budget_year
export const useSearchBudgetYears = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_YEAR_QUERY_KEY, searchParams],
    queryFn: () => getBudgetYear(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

//for populating dropdown
export const usePopulateBudgetYears = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_YEAR_QUERY_KEY, searchParams],
    queryFn: () => populateBudgetYear(searchParams),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Add budget_year
export const useAddBudgetYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetYear,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( BUDGET_YEAR_QUERY_KEY, (oldData) => {
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

// Update budget_year
export const useUpdateBudgetYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetYear,
    onSuccess: (updatedBudgetYear) => {
      queryClient.setQueryData(BUDGET_YEAR_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((BudgetYearData) =>
            BudgetYearData.bdy_id === updatedBudgetYear.data.bdy_id
              ? { ...BudgetYearData, ...updatedBudgetYear.data }
              : BudgetYearData
          ),
        };
      });
    },
  });
};

// Delete budget_year
export const useDeleteBudgetYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetYear,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(BUDGET_YEAR_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (BudgetYearData) => BudgetYearData.bdy_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
