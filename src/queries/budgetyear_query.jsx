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
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

//for populating dropdown
export const usePopulateBudgetYears = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_YEAR_QUERY_KEY, searchParams],
    queryFn: () => populateBudgetYear(searchParams),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Add budget_year
export const useAddBudgetYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetYear,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_YEAR_QUERY_KEY })
    },
  });
};

// Update budget_year
export const useUpdateBudgetYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetYear,
    onSuccess: (updatedBudgetYear) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_YEAR_QUERY_KEY })
    },
  });
};

// Delete budget_year
export const useDeleteBudgetYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetYear,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_YEAR_QUERY_KEY })
    },
  });
};
