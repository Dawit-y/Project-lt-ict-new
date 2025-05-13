import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetSource,
  updateBudgetSource,
  addBudgetSource,
  deleteBudgetSource,
} from "../helpers/budgetsource_backend_helper";

const BUDGET_SOURCE_QUERY_KEY = ["budgetsource"];

// Fetch budget_source
export const useFetchBudgetSources = () => {
  return useQuery({
    queryKey: BUDGET_SOURCE_QUERY_KEY,
    queryFn: () => getBudgetSource(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search budget_source
export const useSearchBudgetSources = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_SOURCE_QUERY_KEY, searchParams],
    queryFn: () => getBudgetSource(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add budget_source
export const useAddBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetSource,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(BUDGET_SOURCE_QUERY_KEY, (oldData) => {
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

// Update budget_source
export const useUpdateBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetSource,
    onSuccess: (updatedBudgetSource) => {
      queryClient.setQueryData(BUDGET_SOURCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((BudgetSourceData) =>
            BudgetSourceData.pbs_id === updatedBudgetSource.data.pbs_id
              ? { ...BudgetSourceData, ...updatedBudgetSource.data }
              : BudgetSourceData
          ),
        };
      });
    },
  });
};

// Delete budget_source
export const useDeleteBudgetSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetSource,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(BUDGET_SOURCE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (BudgetSourceData) => BudgetSourceData.pbs_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
