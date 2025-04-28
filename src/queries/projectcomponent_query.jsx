import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectComponent,
  updateProjectComponent,
  addProjectComponent,
  deleteProjectComponent,
} from "../helpers/projectcomponent_backend_helper";

const PROJECT_COMPONENT_QUERY_KEY = ["projectcomponent"];
// Fetch project_component
export const useFetchProjectComponents = () => {
  return useQuery({
    queryKey: PROJECT_COMPONENT_QUERY_KEY,
    queryFn: () => getProjectComponent(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_component
export const useSearchProjectComponents = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_COMPONENT_QUERY_KEY, searchParams],
    queryFn: () => getProjectComponent(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add project_component
export const useAddProjectComponent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectComponent,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
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
// Update project_component
export const useUpdateProjectComponent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectComponent,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.pcm_id === updatedData.data.pcm_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete project_component
export const useDeleteProjectComponent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectComponent,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) => deletedData.pcm_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
