import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectVariation,
  updateProjectVariation,
  addProjectVariation,
  deleteProjectVariation,
} from "../helpers/projectvariation_backend_helper";

const PROJECT_VARIATION_QUERY_KEY = ["projectvariation"];

// Fetch project_variation
export const useFetchProjectVariations = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_VARIATION_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectVariation(param),
    staleTime: 0,
    meta: { persist: true },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isActive,
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
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_VARIATION_QUERY_KEY,
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

// Update project_variation
export const useUpdateProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectVariation,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_VARIATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prv_id === updatedData.data.prv_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_variation
export const useDeleteProjectVariation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectVariation,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_VARIATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prv_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
