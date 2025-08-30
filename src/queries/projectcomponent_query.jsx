import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectComponent,
  updateProjectComponent,
  addProjectComponent,
  deleteProjectComponent,
} from "../helpers/projectcomponent_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_COMPONENT_QUERY_KEY = ["projectcomponent"];
// Fetch project_component
export const useFetchProjectComponents = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_COMPONENT_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectComponent(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _newData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (newDataResponse) => {
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Update project_component
export const useUpdateProjectComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectComponent,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.pcm_id === updatedData.data.pcm_id ? { ...d, ...updatedData.data } : d,
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _updatedData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Delete project_component
export const useDeleteProjectComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectComponent,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_COMPONENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.pcm_id !== parseInt(id),
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
              (deletedData) =>
                deletedData.pcm_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_COMPONENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
