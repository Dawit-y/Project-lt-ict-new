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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
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
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
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
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });
    },
  });
};

// Update budget_request_amount
export const useUpdateBudgetRequestAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetRequestAmount,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bra_id === updatedData.data.bra_id ? { ...d, ...updatedData.data } : d,
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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });
    },
  });
};

// Delete budget_request_amount
export const useDeleteBudgetRequestAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetRequestAmount,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_AMOUNT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bra_id !== parseInt(id),
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
              (dept) => dept.bra_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUEST_AMOUNT_QUERY_KEY,
      });
    },
  });
};
