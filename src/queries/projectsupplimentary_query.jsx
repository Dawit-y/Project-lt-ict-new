import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectSupplimentary,
  updateProjectSupplimentary,
  addProjectSupplimentary,
  deleteProjectSupplimentary,
} from "../helpers/projectsupplimentary_backend_helper";

const PROJECT_SUPPLIMENTARY_QUERY_KEY = ["projectsupplimentary"];

// Fetch project_supplimentary
export const useFetchProjectSupplimentarys = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectSupplimentary(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_supplimentary
export const useSearchProjectSupplimentarys = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectSupplimentary(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_supplimentary
export const useAddProjectSupplimentary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectSupplimentary,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);
    },
  });
};

// Update project_supplimentary
export const useUpdateProjectSupplimentary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectSupplimentary,
    onSuccess: (updatedProjectSupplimentary) => {
      queryClient.invalidateQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);
    },
  });
};

// Delete project_supplimentary
export const useDeleteProjectSupplimentary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectSupplimentary,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);
    },
  });
};
