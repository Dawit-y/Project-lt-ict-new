import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectStakeholder,
  updateProjectStakeholder,
  addProjectStakeholder,
  deleteProjectStakeholder,
} from "../helpers/projectstakeholder_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_STAKEHOLDER_QUERY_KEY = ["projectstakeholder"];

// Fetch project_stakeholder
export const useFetchProjectStakeholders = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectStakeholder(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_stakeholder
export const useSearchProjectStakeholders = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_STAKEHOLDER_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectStakeholder(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_stakeholder
export const useAddProjectStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectStakeholder,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
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
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
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
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_stakeholder
export const useUpdateProjectStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectStakeholder,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.psh_id === updatedData.data.psh_id ? { ...d, ...updatedData.data } : d,
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
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.psh_id === updatedData.data.psh_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_stakeholder
export const useDeleteProjectStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectStakeholder,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_STAKEHOLDER_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.psh_id !== parseInt(id),
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
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.psh_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAKEHOLDER_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
