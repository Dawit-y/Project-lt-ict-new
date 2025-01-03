import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserRole,
  addUserRole,
  updateUserRole,
  deleteUserRole,
} from "../helpers/userrole_backend_helper";

const USER_ROLE_QUERY_KEY = ["user_role"];

// Fetch roles
export const useFetchUserRoles = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...USER_ROLE_QUERY_KEY, "fetch", param],
    queryFn: () => getUserRole(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search roles
export const useSearchUserRoles = (searchParams = {}) => {
  return useQuery({
    queryKey: [...USER_ROLE_QUERY_KEY, "search", searchParams],
    queryFn: () => getUserRole(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add roles
export const useAddUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserRole,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: USER_ROLE_QUERY_KEY,
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

// Update roles
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: USER_ROLE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.url_id === updatedData.data.url_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete roles
export const useDeleteUserRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserRole,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: USER_ROLE_QUERY_KEY,
      });
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.url_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
