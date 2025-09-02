import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetRequest,
  addBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,
  getBudgetRequestforApproval,
  updateBudgetRequestApproval,
  bulkUpdateBudgetRequestApproval,
  fetchBudgetRequest,
} from "../helpers/budgetrequest_backend_helper";

const BUDGET_REQUESTS_QUERY_KEY = ["budgetrequest"];

export const useFetchBudgetRequests = (params = {}) => {
  return useQuery({
    queryKey: [...BUDGET_REQUESTS_QUERY_KEY, params],
    queryFn: () => getBudgetRequest(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useFetchBudgetRequest = (id, userId, isActive = false) => {
  return useQuery({
    queryKey: [...BUDGET_REQUESTS_QUERY_KEY, "detail", id, userId],
    queryFn: () => fetchBudgetRequest(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id && !!userId && isActive,
  });
};

export const useSearchBudgetRequests = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_REQUESTS_QUERY_KEY, searchParams],
    queryFn: () => {
      // If searchParams is empty, return an empty result or handle it accordingly
      if (Object.keys(searchParams).length === 0) {
        return Promise.resolve([]); // or return null, or handle it as per your requirement
      }
      return getBudgetRequest(searchParams);
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true, // Always enable the query
  });
};

export const useSearchBudgetRequestforApproval = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_REQUESTS_QUERY_KEY, "search", searchParams],
    queryFn: () => getBudgetRequestforApproval(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Object.keys(searchParams).length > 0,
  });
};

export const useUpdateBudgetRequestApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetRequestApproval,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
        exact: false,
        refetchType: "all",
      });
    },
  });
};
export const useAddBudgetRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetRequest,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
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
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
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
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });
    },
  });
};

export const useUpdateBudgetRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetRequest,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bdr_id === updatedData.bdr_id ? { ...d, ...updatedData } : d,
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

    onSuccess: (updatedBudgetRequest, variables) => {
      const allQueries = queryClient
        .getQueriesData({ queryKey: BUDGET_REQUESTS_QUERY_KEY })
        .map(([key, data]) => ({ key, data }));

      allQueries.forEach(({ key }) => {
        queryClient.setQueryData(key, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((BudgetRequestData) =>
              BudgetRequestData.bdr_id === updatedBudgetRequest.data.bdr_id
                ? { ...BudgetRequestData, ...updatedBudgetRequest.data }
                : BudgetRequestData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteBudgetRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetRequest,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_REQUESTS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetRequestData) =>
                BudgetRequestData.bdr_id !== parseInt(id),
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
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetRequestData) =>
                BudgetRequestData.bdr_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
      });
    },
  });
};

export const useBulkUpdateBudgetRequestApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateBudgetRequestApproval,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUESTS_QUERY_KEY,
        exact: false,
        refetchType: "all",
      });
    },
  });
};
