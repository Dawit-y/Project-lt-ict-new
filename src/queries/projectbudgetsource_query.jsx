import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBudgetSource,
  updateProjectBudgetSource,
  addProjectBudgetSource,
  deleteProjectBudgetSource,
} from "../helpers/projectbudgetsource_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_BUDGET_SOURCE_QUERY_KEY = ["projectbudgetsource"];

// Fetch project_budget_source
export const useFetchProjectBudgetSources = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectBudgetSource(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_budget_source
export const useSearchProjectBudgetSources = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_BUDGET_SOURCE_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectBudgetSource(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_budget_source
export const useAddProjectBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectBudgetSource,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
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
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
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
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_budget_source
export const useUpdateProjectBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectBudgetSource,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bsr_id === updatedData.bsr_id ? { ...d, ...updatedData } : d,
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

    onSuccess: (updatedProjectBudgetSource) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.bsr_id === updatedProjectBudgetSource.data.bsr_id
                ? { ...data, ...updatedProjectBudgetSource.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_budget_source
export const useDeleteProjectBudgetSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectBudgetSource,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_BUDGET_SOURCE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (projectBSource) => projectBSource.bsr_id !== parseInt(id),
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
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (projectBSource) => projectBSource.bsr_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_BUDGET_SOURCE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
