import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStatus,
  updateProjectStatus,
  addProjectStatus,
  deleteProjectStatus,
} from "../helpers/projectstatus_backend_helper";

const PROJECT_STATUS_QUERY_KEY = ["projectstatus"];

// Fetch project_status
export const useFetchProjectStatuss = () => {
  return useQuery({
    queryKey: PROJECT_STATUS_QUERY_KEY,
    queryFn: () => getProjectStatus(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_status
export const useSearchProjectStatuss = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STATUS_QUERY_KEY, searchParams],
    queryFn: () => getProjectStatus(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_status
export const useAddProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectStatus,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_STATUS_QUERY_KEY, (oldData) => {
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

// Update project_status
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectStatus,
    onSuccess: (updatedProjectStatus) => {
      queryClient.setQueryData(PROJECT_STATUS_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectStatusData) =>
            ProjectStatusData.prs_id === updatedProjectStatus.data.prs_id
              ? { ...ProjectStatusData, ...updatedProjectStatus.data }
              : ProjectStatusData
          ),
        };
      });
    },
  });
};

// Delete project_status
export const useDeleteProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectStatus,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_STATUS_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectStatusData) => ProjectStatusData.prs_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
