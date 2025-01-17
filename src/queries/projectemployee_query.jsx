import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectEmployee,
  updateProjectEmployee,
  addProjectEmployee,
  deleteProjectEmployee,
} from "../helpers/projectemployee_backend_helper";

const PROJECT_EMPLOYEE_QUERY_KEY = ["projectemployee"];

// Fetch project_employee
export const useFetchProjectEmployees = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectEmployee(param),
    /*staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,*/
    staleTime: 0,
    meta: { persist: true },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isActive,
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
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
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

// Update project_employee
export const useUpdateProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectEmployee,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.emp_id === updatedData.data.emp_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_employee
export const useDeleteProjectEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectEmployee,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.emp_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
