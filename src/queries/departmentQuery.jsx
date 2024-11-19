import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartment,
  updateDepartment,
  addDepartment,
  deleteDepartment,
} from "../helpers/department_backend_helper";

const DEPARTMENT_QUERY_KEY = ["departments"];

// Fetch Departments
export const useFetchDepartments = () => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEY,
    queryFn: getDepartment,
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Add Department
export const useAddDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDepartment,
    onSuccess: (newDepartmentResponse) => {
      queryClient.setQueryData(DEPARTMENT_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          previledge: newDepartmentResponse.previledge,
          data: [newDepartmentResponse.data, ...oldData.data],
        };
      });
    },
  });
};

// Update Department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: (updatedDepartment) => {
      queryClient.setQueryData(DEPARTMENT_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((dept) =>
            dept.dep_id === updatedDepartment.data.dep_id
              ? { ...dept, ...updatedDepartment.data }
              : dept
          ),
        };
      });
    },
  });
};

// Delete Department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (deletedDepartment) => {
      queryClient.setQueryData(DEPARTMENT_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (dept) => dept.dep_id !== deletedDepartment.deleted_id
          ),
        };
      });
    },
  });
};
