import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetExipDetail,
  updateBudgetExipDetail,
  addBudgetExipDetail,
  deleteBudgetExipDetail,
} from "../helpers/budgetexipdetail_backend_helper";

const BUDGET_EXIP_DETAIL_QUERY_KEY = ["budgetexipdetail"];
// Fetch budget_exip_detail
export const useFetchBudgetExipDetails = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...BUDGET_EXIP_DETAIL_QUERY_KEY, "fetch", param],
    queryFn: () => getBudgetExipDetail(param),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search budget_exip_detail
export const useSearchBudgetExipDetails = (searchParams = {}) => {
  return useQuery({
    queryKey: [...BUDGET_EXIP_DETAIL_QUERY_KEY, searchParams],
    queryFn: () => getBudgetExipDetail(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add budget_exip_detail
export const useAddBudgetExipDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetExipDetail,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
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
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
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
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });
    },
  });
};

// Update budget_exip_detail
export const useUpdateBudgetExipDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudgetExipDetail,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.bed_id === updatedData.data.bed_id ? { ...d, ...updatedData.data } : d,
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

    onSuccess: (updatedBudgetExipDetail) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.bed_id === updatedBudgetExipDetail.data.bed_id
                ? { ...data, ...updatedBudgetExipDetail.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });
    },
  });
};

// Delete budget_exip_detail
export const useDeleteBudgetExipDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetExipDetail,

    onMutate: async (id) => {
      await queryClient.cancelQueries(BUDGET_EXIP_DETAIL_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bed_id !== parseInt(id),
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
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.bed_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
      });
    },
  });
};
