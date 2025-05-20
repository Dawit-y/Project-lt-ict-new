import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  addRoles,
  updateRoles,
  deleteRoles,
} from "../helpers/roles_backend_helper";

const ROLES_QUERY_KEY = ["roles"];

// Fetch roles
export const useFetchRoles = () => {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: () => getRoles(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search roles
export const useSearchRoles = (searchParams = {}) => {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, "search", searchParams],
    queryFn: () => getRoles(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add roles
export const useAddRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRoles,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: ROLES_QUERY_KEY,
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
export const useUpdateRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoles,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(ROLES_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.map((data) =>
            data.rol_id === updatedData.data.rol_id
              ? { ...data, ...updatedData.data }
              : data
          ),
        };
      });
    },
  });
};

// Delete roles
export const useDeleteRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoles,
    onSuccess: (deletedData, variable) => {
      queryClient.setQueryData(ROLES_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (data) => data.rol_id !== parseInt(variable)
          ),
        };
      });
    },
  });
};
