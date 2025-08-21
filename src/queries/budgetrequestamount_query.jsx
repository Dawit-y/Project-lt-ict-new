import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetRequestAmount,
  updateBudgetRequestAmount,
  addBudgetRequestAmount,
  deleteBudgetRequestAmount,
} from "../helpers/budgetrequestamount_backend_helper";

const BUDGET_REQUEST_AMOUNT_QUERY_KEY = ["budgetrequestamount"];

// Fetch budget_request_amount
export const useFetchBudgetRequestAmounts = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...BUDGET_REQUEST_AMOUNT_QUERY_KEY, "fetch", param],
    queryFn: () => getBudgetRequestAmount(param),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    meta: { persist: false },
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search budget_request_amount
export const useSearchBudgetRequestAmounts = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_REQUEST_AMOUNT_QUERY_KEY, searchParams],
    queryFn: () => getBudgetRequestAmount(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add budget_request_amount
export const useAddBudgetRequestAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetRequestAmount,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
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

// Update budget_request_amount
export const useUpdateBudgetRequestAmount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetRequestAmount,
    onSuccess: (updatedBudgetRequestAmount) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.bra_id === updatedBudgetRequestAmount.data.bra_id
                ? { ...data, ...updatedBudgetRequestAmount.data }
                : data,
            ),
          };
        });
      });
    },
  });
};

// Delete budget_request_amount
export const useDeleteBudgetRequestAmount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetRequestAmount,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bra_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },
  });
};
