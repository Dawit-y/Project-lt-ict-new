import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectHandover,
  updateProjectHandover,
  addProjectHandover,
  deleteProjectHandover,
} from "../helpers/projecthandover_backend_helper";

const PROJECT_HANDOVER_QUERY_KEY = ["projecthandover"];

// Fetch project_handover
export const useFetchProjectHandovers = () => {
  return useQuery({
    queryKey: PROJECT_HANDOVER_QUERY_KEY,
    queryFn: () => getProjectHandover(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_handover
export const useSearchProjectHandovers = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_HANDOVER_QUERY_KEY, searchParams],
    queryFn: () => getProjectHandover(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_handover
export const useAddProjectHandover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectHandover,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_HANDOVER_QUERY_KEY, (oldData) => {
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

// Update project_handover
export const useUpdateProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectHandover,
    onSuccess: (updatedProjectHandover) => {
      queryClient.setQueryData(PROJECT_HANDOVER_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectHandoverData) =>
            ProjectHandoverData.prh_id === updatedProjectHandover.data.prh_id
              ? { ...ProjectHandoverData, ...updatedProjectHandover.data }
              : ProjectHandoverData
          ),
        };
      });
    },
  });
};

// Delete project_handover
export const useDeleteProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectHandover,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_HANDOVER_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectHandoverData) => ProjectHandoverData.prh_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
