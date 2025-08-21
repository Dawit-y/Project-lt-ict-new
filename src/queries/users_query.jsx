import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  updateUsers,
  addUsers,
  deleteUsers,
  changeUserStatus,
  changePassword,
  updateProfile,
  getUser,
} from "../helpers/users_backend_helper";

const USERS_QUERY_KEY = ["users"];

// Fetch users
export const useFetchUserss = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    meta: { persist: false },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search users
export const useFetchUser = (searchParams = {}) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, "detail", searchParams],
    queryFn: () => getUser(searchParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Object.keys(searchParams).length > 0,
  });
};

//search users
export const useSearchUserss = (searchParams = {}) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, "search", searchParams],
    queryFn: () => getUsers(searchParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Object.keys(searchParams).length > 0,
  });
};

// Add users
export const useAddUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUsers,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        const newData = {
          ...newDataResponse.data,
        };
        return {
          ...oldData,
          data: [newData, ...oldData.data],
        };
      });
    },
  });
};

// Update users
export const useUpdateUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUsers,
    onSuccess: (updatedUsers) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((UsersData) =>
            UsersData.usr_id === updatedUsers.data.usr_id
              ? { ...UsersData, ...updatedUsers.data }
              : UsersData,
          ),
        };
      });
    },
  });
};

// Update users
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUsers) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((UsersData) =>
            UsersData.usr_id === updatedUsers.data.usr_id
              ? { ...UsersData, ...updatedUsers.data }
              : UsersData,
          ),
        };
      });
    },
  });
};

export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeUserStatus,
    onSuccess: (updatedUsers) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((UsersData) =>
            UsersData.usr_id === updatedUsers.data.usr_id
              ? { ...UsersData, ...updatedUsers.data }
              : UsersData,
          ),
        };
      });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (updatedUsers) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((UsersData) =>
            UsersData.usr_id === updatedUsers.data.usr_id
              ? { ...UsersData, ...updatedUsers.data }
              : UsersData,
          ),
        };
      });
    },
  });
};

// Delete users
export const useDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: (deletedData, variable) => {
      queryClient.setQueryData(USERS_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (UsersData) => UsersData.usr_id !== parseInt(variable),
          ),
        };
      });
    },
  });
};
