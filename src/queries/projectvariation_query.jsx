import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectVariation,
  updateProjectVariation,
  addProjectVariation,
  deleteProjectVariation,
} from "../helpers/projectvariation_backend_helper";

const PROJECT_VARIATION_QUERY_KEY = ["projectvariation"];

// Fetch project_variation
export const useFetchProjectVariations = () => {
  return useQuery({
    queryKey: PROJECT_VARIATION_QUERY_KEY,
    queryFn: () => getProjectVariation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_variation
export const useSearchProjectVariations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_VARIATION_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( PROJECT_VARIATION_QUERY_KEY, (oldData) => {
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

// Update project_variation
export const useUpdateProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectVariation,
    onSuccess: (updatedProjectVariation) => {
      queryClient.setQueryData(PROJECT_VARIATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectVariationData) =>
            ProjectVariationData.bdr_id === updatedProjectVariation.data.bdr_id
              ? { ...ProjectVariationData, ...updatedProjectVariation.data }
              : ProjectVariationData
          ),
        };
      });
    },
  });
};

// Delete project_variation
export const useDeleteProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectVariation,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_VARIATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectVariationData) => ProjectVariationData.bdr_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
