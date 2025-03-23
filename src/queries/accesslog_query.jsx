import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccessLog,
  updateAccessLog,
  addAccessLog,
  deleteAccessLog,
} from "../helpers/accesslog_backend_helper";

const ACCESS_LOG_QUERY_KEY = ["accesslog"];

// Fetch access_log
export const useFetchAccessLogs = () => {
  return useQuery({
    queryKey: ACCESS_LOG_QUERY_KEY,
    queryFn: () => getAccessLog(),
    staleTime: 0,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchAccessLogsByProps = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...ACCESS_LOG_QUERY_KEY, "fetch", param],
    queryFn: () => getAccessLog(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search access_log
export const useSearchAccessLogs = (searchParams = {}) => {
  return useQuery({
    queryKey: [...ACCESS_LOG_QUERY_KEY, searchParams],
    queryFn: () => getAccessLog(searchParams),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add access_log
export const useAddAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAccessLog,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(ACCESS_LOG_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        const newData = {
          ...newDataResponse.data,
          ...newDataResponse.previledge,
        };
        return {
          ...oldData,
          data: [newData, ...oldData.data],
        };
      });
    },
  });
};

// Update access_log
export const useUpdateAccessLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccessLog,
    onSuccess: (updatedAccessLog) => {
      queryClient.setQueryData(ACCESS_LOG_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((AccessLogData) =>
            AccessLogData.acl_id === updatedAccessLog.data.acl_id
              ? { ...AccessLogData, ...updatedAccessLog.data }
              : AccessLogData
          ),
        };
      });
    },
  });
};

// Delete access_log
export const useDeleteAccessLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccessLog,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(ACCESS_LOG_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (AccessLogData) =>
              AccessLogData.acl_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
