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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
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
        queryKey: BUDGET_SOURCE_QUERY_KEY,
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
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });
    },
  });
};

// Update budget_source
export const useUpdateBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetSource,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.pbs_id === updatedData.data.pbs_id ? { ...d, ...updatedData.data } : d,
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

    onSuccess: (updatedBudgetSource) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((BudgetSourceData) =>
              BudgetSourceData.pbs_id === updatedBudgetSource.data.pbs_id
                ? { ...BudgetSourceData, ...updatedBudgetSource.data }
                : BudgetSourceData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });
    },
  });
};

// Delete budget_source
export const useDeleteBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetSource,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetSourceData) =>
                BudgetSourceData.pbs_id !== parseInt(id),
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
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetSourceData) =>
                BudgetSourceData.pbs_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_SOURCE_QUERY_KEY,
      });
    },
  });
};
