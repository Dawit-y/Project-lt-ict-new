import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectHandover,
  updateProjectHandover,
  addProjectHandover,
  deleteProjectHandover,
} from "../helpers/projecthandover_backend_helper";

const PROJECT_HANDOVER_QUERY_KEY = ["projecthandover"];

// Fetch project_handover
export const useFetchProjectHandovers = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_HANDOVER_QUERY_KEY,"fetch", param],
    queryFn: () => getProjectHandover(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_handover
export const useSearchProjectHandovers = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_HANDOVER_QUERY_KEY, "search", searchParams],
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
      queryClient.invalidateQueries(PROJECT_HANDOVER_QUERY_KEY);
    },
  });
};

// Update project_handover
export const useUpdateProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectHandover,
    onSuccess: (updatedProjectHandover) => {
      queryClient.invalidateQueries(PROJECT_HANDOVER_QUERY_KEY);
    },
  });
};

// Delete project_handover
export const useDeleteProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectHandover,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_HANDOVER_QUERY_KEY);
    },
  });
};
