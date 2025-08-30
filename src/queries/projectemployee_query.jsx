import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectEmployee,
  updateProjectEmployee,
  addProjectEmployee,
  deleteProjectEmployee,
} from "../helpers/projectemployee_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_EMPLOYEE_QUERY_KEY = ["projectemployee"];

// Fetch project_employee
export const useFetchProjectEmployees = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectEmployee(param),
    staleTime: 1000 * 60 * 5,
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _newData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (newDataResponse) => {
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_employee
export const useUpdateProjectEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectEmployee,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.emp_id === updatedData.data.emp_id ? { ...d, ...updatedData.data } : d,
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _updatedData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_employee
export const useDeleteProjectEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectEmployee,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.emp_id !== parseInt(id),
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
              (dept) => dept.emp_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
