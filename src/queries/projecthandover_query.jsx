import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectHandover,
  updateProjectHandover,
  addProjectHandover,
  deleteProjectHandover,
} from "../helpers/projecthandover_backend_helper";

const PROJECT_HANDOVER_QUERY_KEY = ["projecthandover"];

// Fetch project_handover
export const useFetchProjectHandovers = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_HANDOVER_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectHandover(param),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    meta: { persist: true },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isActive,
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
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_HANDOVER_QUERY_KEY,
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

// Update project_handover
export const useUpdateProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectHandover,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_HANDOVER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prh_id === updatedData.data.prh_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_handover
export const useDeleteProjectHandover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectHandover,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_HANDOVER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prh_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
