import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetRequestTask,
  updateBudgetRequestTask,
  addBudgetRequestTask,
  deleteBudgetRequestTask,
} from "../helpers/budgetrequesttask_backend_helper";

const BUDGET_REQUEST_TASK_QUERY_KEY = ["budgetrequesttask"];

// Fetch budget_request_task
export const useFetchBudgetRequestTasks = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...BUDGET_REQUEST_TASK_QUERY_KEY, "fetch", param],
    queryFn: () => getBudgetRequestTask(param),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    meta: { persist: false },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search budget_request_task
export const useSearchBudgetRequestTasks = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_REQUEST_TASK_QUERY_KEY, "search", searchParams],
    queryFn: () => getBudgetRequestTask(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add budget_request_task
export const useAddBudgetRequestTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetRequestTask,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
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
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
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
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });
    },
  });
};

// Update budget_request_task
export const useUpdateBudgetRequestTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetRequestTask,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.brt_id === updatedData.data.brt_id ? { ...d, ...updatedData.data } : d,
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

    onSuccess: (updatedBudgetRequestTask) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.brt_id === updatedBudgetRequestTask.data.brt_id
                ? { ...data, ...updatedBudgetRequestTask.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });
    },
  });
};

// Delete budget_request_task
export const useDeleteBudgetRequestTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetRequestTask,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_REQUEST_TASK_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.brt_id !== parseInt(id),
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
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.brt_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_REQUEST_TASK_QUERY_KEY,
      });
    },
  });
};
