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
    queryKey: [...BUDGET_EXIP_DETAIL_QUERY_KEY,"fetch", param],
    queryFn: () => getBudgetExipDetail(param),
  staleTime: 0, // Data is considered stale immediately
    cacheTime: 0,
    meta: { persist: false },
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    enabled: true
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
   onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: BUDGET_EXIP_DETAIL_QUERY_KEY,
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

// Update budget_exip_detail
export const useUpdateBudgetExipDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudgetExipDetail,
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
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete budget_exip_detail
export const useDeleteBudgetExipDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudgetExipDetail,
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
              (dept) => dept.bed_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
