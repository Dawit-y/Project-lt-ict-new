import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStakeholder,
  updateProjectStakeholder,
  addProjectStakeholder,
  deleteProjectStakeholder,
} from "../helpers/projectstakeholder_backend_helper";

const PROJECT_STAKEHOLDER_QUERY_KEY = ["projectstakeholder"];

// Fetch project_stakeholder
export const useFetchProjectStakeholders = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectStakeholder(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_stakeholder
export const useSearchProjectStakeholders = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectStakeholder(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_stakeholder
export const useAddProjectStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectStakeholder,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
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

// Update project_stakeholder
export const useUpdateProjectStakeholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectStakeholder,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.psh_id === updatedData.data.psh_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },
  });
};

// Delete project_stakeholder
export const useDeleteProjectStakeholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectStakeholder,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.psh_id !== parseInt(variable),
            ),
          };
        });
      });
    },
  });
};
