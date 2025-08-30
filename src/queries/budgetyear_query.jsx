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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_YEAR_QUERY_KEY,
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
        queryKey: BUDGET_YEAR_QUERY_KEY,
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
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });
    },
  });
};

// Update budget_year
export const useUpdateBudgetYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetYear,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bdy_id === updatedData.bdy_id ? { ...d, ...updatedData } : d,
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

    onSuccess: (updatedBudgetYear) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((BudgetYearData) =>
              BudgetYearData.bdy_id === updatedBudgetYear.data.bdy_id
                ? { ...BudgetYearData, ...updatedBudgetYear.data }
                : BudgetYearData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });
    },
  });
};

// Delete budget_year
export const useDeleteBudgetYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetYear,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_YEAR_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetYearData) =>
                BudgetYearData.bdy_id !== parseInt(id),
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
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (BudgetYearData) =>
                BudgetYearData.bdy_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_YEAR_QUERY_KEY,
      });
    },
  });
};
