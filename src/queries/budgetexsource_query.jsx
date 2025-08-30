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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
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
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
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
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });
    },
  });
};

// Update budget_ex_source
export const useUpdateBudgetExSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetExSource,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bes_id === updatedData.data.bes_id ? { ...d, ...updatedData.data } : d,
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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });
    },
  });
};

// Delete budget_ex_source
export const useDeleteBudgetExSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetExSource,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_EX_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bes_id !== parseInt(id),
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
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bes_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_EX_SOURCE_QUERY_KEY,
      });
    },
  });
};
