import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStatus,
  updateProjectStatus,
  addProjectStatus,
  deleteProjectStatus,
} from "../helpers/projectstatus_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_STATUS_QUERY_KEY = ["projectstatus"];

// Fetch project_status
export const useFetchProjectStatuss = () => {
  return useQuery({
    queryKey: PROJECT_STATUS_QUERY_KEY,
    queryFn: () => getProjectStatus(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search project_status
export const useSearchProjectStatuss = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STATUS_QUERY_KEY, searchParams],
    queryFn: () => getProjectStatus(searchParams),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Add project_status
export const useAddProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectStatus,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STATUS_QUERY_KEY,
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
        queryKey: PROJECT_STATUS_QUERY_KEY,
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
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_status
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectStatus,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.prs_id === updatedData.data.prs_id ? { ...d, ...updatedData.data } : d,
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

    onSuccess: (updatedProjectStatus) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((ProjectStatusData) =>
              ProjectStatusData.prs_id === updatedProjectStatus.data.prs_id
                ? { ...ProjectStatusData, ...updatedProjectStatus.data }
                : ProjectStatusData,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_status
export const useDeleteProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectStatus,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_STATUS_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ProjectStatusData) =>
                ProjectStatusData.prs_id !== parseInt(id),
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

    onSuccess: (deletedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ProjectStatusData) =>
                ProjectStatusData.prs_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
