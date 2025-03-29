import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcurementInformation,
  updateProcurementInformation,
  addProcurementInformation,
  deleteProcurementInformation,
} from "../helpers/procurementinformation_backend_helper";


const PROCUREMENT_INFORMATION_QUERY_KEY = ["procurementinformation"];

export const useFetchProcurementInformations = () => {
  return useQuery({
    queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
    queryFn: () => getProcurementInformation(),
    cacheTime: 0,          // Disables caching
    staleTime: 0,          // Data becomes stale immediately
    meta: { persist: false },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
//search procurement_information
export const useSearchProcurementInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROCUREMENT_INFORMATION_QUERY_KEY, searchParams],
    queryFn: () => getProcurementInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add procurement_information
export const useAddProcurementInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProcurementInformation,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
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
// Update procurement_information
export const useUpdateProcurementInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcurementInformation,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.pri_id === updatedData.data.pri_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete procurement_information
export const useDeleteProcurementInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcurementInformation,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROCUREMENT_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) => deletedData.pri_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
