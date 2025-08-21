import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcurementMethod,
  updateProcurementMethod,
  addProcurementMethod,
  deleteProcurementMethod,
} from "../helpers/procurementmethod_backend_helper";

const PROCUREMENT_METHOD_QUERY_KEY = ["procurementmethod"];
// Fetch procurement_method
export const useFetchProcurementMethods = () => {
  return useQuery({
    queryKey: PROCUREMENT_METHOD_QUERY_KEY,
    queryFn: () => getProcurementMethod(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search procurement_method
export const useSearchProcurementMethods = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROCUREMENT_METHOD_QUERY_KEY, searchParams],
    queryFn: () => getProcurementMethod(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};
// Add procurement_method
export const useAddProcurementMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProcurementMethod,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_METHOD_QUERY_KEY,
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
// Update procurement_method
export const useUpdateProcurementMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcurementMethod,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_METHOD_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prm_id === updatedData.data.prm_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },
  });
};
// Delete procurement_method
export const useDeleteProcurementMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcurementMethod,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_METHOD_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.prm_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },
  });
};
