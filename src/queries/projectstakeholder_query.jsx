import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStakeholder,
  updateProjectStakeholder,
  addProjectStakeholder,
  deleteProjectStakeholder,
} from "../helpers/projectstakeholder_backend_helper";

const PROJECT_STAKEHOLDER_QUERY_KEY = ["projectstakeholder"];

// Fetch project_stakeholder
export const useFetchProjectStakeholders = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectStakeholder(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_stakeholder
export const useSearchProjectStakeholders = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( PROJECT_STAKEHOLDER_QUERY_KEY, (oldData) => {
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

// Update project_stakeholder
export const useUpdateProjectStakeholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectStakeholder,
    onSuccess: (updatedProjectStakeholder) => {
      queryClient.setQueryData(PROJECT_STAKEHOLDER_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectStakeholderData) =>
            ProjectStakeholderData.psh_id === updatedProjectStakeholder.data.psh_id
              ? { ...ProjectStakeholderData, ...updatedProjectStakeholder.data }
              : ProjectStakeholderData
          ),
        };
      });
    },
  });
};

// Delete project_stakeholder
export const useDeleteProjectStakeholder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectStakeholder,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_STAKEHOLDER_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectStakeholderData) => ProjectStakeholderData.psh_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
