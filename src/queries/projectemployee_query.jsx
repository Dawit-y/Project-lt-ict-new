import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectEmployee,
  updateProjectEmployee,
  addProjectEmployee,
  deleteProjectEmployee,
} from "../helpers/projectemployee_backend_helper";

const PROJECT_EMPLOYEE_QUERY_KEY = ["projectemployee"];

// Fetch project_employee
export const useFetchProjectEmployees = () => {
  return useQuery({
    queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
    queryFn: () => getProjectEmployee(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_employee
export const useSearchProjectEmployees = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, searchParams],
    queryFn: () => getProjectEmployee(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_employee
export const useAddProjectEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectEmployee,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_EMPLOYEE_QUERY_KEY, (oldData) => {
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

// Update project_employee
export const useUpdateProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectEmployee,
    onSuccess: (updatedProjectEmployee) => {
      queryClient.setQueryData(PROJECT_EMPLOYEE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectEmployeeData) =>
            ProjectEmployeeData.emp_id === updatedProjectEmployee.data.emp_id
              ? { ...ProjectEmployeeData, ...updatedProjectEmployee.data }
              : ProjectEmployeeData
          ),
        };
      });
    },
  });
};

// Delete project_employee
export const useDeleteProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectEmployee,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_EMPLOYEE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectEmployeeData) => ProjectEmployeeData.emp_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
