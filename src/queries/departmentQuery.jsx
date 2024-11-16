import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartment,
  updateDepartment,
  addDepartment,
  deleteDepartment,
} from "../helpers/department_backend_helper";
import { toast } from "react-toastify";

const DEPARTMENT_QUERY_KEY = ["departments"]; // Always use an array for query keys

// Fetch Departments
export const useDepartments = () => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEY,
    queryFn: getDepartment,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onError: (error) => {
      toast.error("Failed to fetch departments");
    },
  });
};

// Add Department
export const useAddDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDepartment,
    onSuccess: (newDepartment) => {
      queryClient.invalidateQueries(DEPARTMENT_QUERY_KEY); // Refresh department data
      toast.success(`Department ${newDepartment.dep_id} added successfully`);
    },
    onError: () => {
      toast.error("Failed to add department");
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
        return oldData.map((dept) =>
          dept.dep_id === updatedDepartment.dep_id ? updatedDepartment : dept
        );
      });
      toast.success(
        `Department ${updatedDepartment.dep_id} updated successfully`
      );
    },
    onError: () => {
      toast.error("Failed to update department");
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
        return oldData.filter(
          (dept) => dept.dep_id !== deletedDepartment.deleted_id
        );
      });
      toast.success(
        `Department ${deletedDepartment.deleted_id} deleted successfully`
      );
    },
    onError: () => {
      toast.error("Failed to delete department");
    },
  });
};
