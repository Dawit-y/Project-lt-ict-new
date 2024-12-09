import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectVariation,
  updateProjectVariation,
  addProjectVariation,
  deleteProjectVariation,
} from "../helpers/projectvariation_backend_helper";

const PROJECT_VARIATION_QUERY_KEY = ["projectvariation"];

// Fetch project_variation
export const useFetchProjectVariations = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_VARIATION_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectVariation(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_variation
export const useSearchProjectVariations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_VARIATION_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectVariation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_variation
export const useAddProjectVariation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectVariation,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries(PROJECT_VARIATION_QUERY_KEY);
    },
  });
};

// Update project_variation
export const useUpdateProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectVariation,
    onSuccess: (updatedProjectVariation) => {
      queryClient.invalidateQueries(PROJECT_VARIATION_QUERY_KEY);
    },
  });
};

// Delete project_variation
export const useDeleteProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectVariation,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries(PROJECT_VARIATION_QUERY_KEY);
    },
  });
};
