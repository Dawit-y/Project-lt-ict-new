import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPermission,
  addPermission,
  updatePermission,
  deletePermission,
  getRoleAssignedPermission,
  getUserAssignedPermission
} from "../helpers/permission_backend_helper";

const PERMISSION_QUERY_KEY = ["permission"];
const ROLE_ASSIGNED_PERMISSION_QUERY_KEY = ["assigned_permission"];
const USER_ASSIGNED_PERMISSION_QUERY_KEY = ["user_assigned_permission"];

// Fetch permission
export const useFetchPermissions = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, "fetch", param],
    queryFn: () => getPermission(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchRoleAssignedPermissions = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...ROLE_ASSIGNED_PERMISSION_QUERY_KEY, "fetch", param],
    queryFn: () => getRoleAssignedPermission(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchUserAssignedPermissions = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...USER_ASSIGNED_PERMISSION_QUERY_KEY, "fetch", param],
    queryFn: () => getUserAssignedPermission(param),
    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });
};

//search permission
export const useSearchPermissions = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, "search", searchParams],
    queryFn: () => getPermission(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add permission
export const useAddPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPermission,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PERMISSION_QUERY_KEY,
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

// Update permission
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PERMISSION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data?.pag_name.toString() ===
                updatedData.data?.pag_name.toString()
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete permission
export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PERMISSION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (permission) => permission.pem_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
