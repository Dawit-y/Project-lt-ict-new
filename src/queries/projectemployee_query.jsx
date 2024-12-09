import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectEmployee,
  updateProjectEmployee,
  addProjectEmployee,
  deleteProjectEmployee,
} from "../helpers/projectemployee_backend_helper";

const PROJECT_EMPLOYEE_QUERY_KEY = ["projectemployee"];

// Fetch project_employee
export const useFetchProjectEmployees = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectEmployee(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_employee
export const useSearchProjectEmployees = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "search", searchParams],
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
      queryClient.invalidateQueries(PROJECT_EMPLOYEE_QUERY_KEY);
    },
  });
};

// Update project_employee
export const useUpdateProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectEmployee,
    onSuccess: (updatedProjectEmployee) => {
      queryClient.invalidateQueries(PROJECT_EMPLOYEE_QUERY_KEY);
    },
  });
};

// Delete project_employee
export const useDeleteProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectEmployee,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_EMPLOYEE_QUERY_KEY);
    },
  });
};
