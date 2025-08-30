import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectSupplimentary,
  updateProjectSupplimentary,
  addProjectSupplimentary,
  deleteProjectSupplimentary,
} from "../helpers/projectsupplimentary_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_SUPPLIMENTARY_QUERY_KEY = ["projectsupplimentary"];

// Fetch project_supplimentary
export const useFetchProjectSupplimentarys = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectSupplimentary(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
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
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
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
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_supplimentary
export const useUpdateProjectSupplimentary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectSupplimentary,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
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

    onSuccess: (updatedProjectSupplimentary) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prs_id === updatedProjectSupplimentary.data.prs_id
                ? { ...data, ...updatedProjectSupplimentary.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_supplimentary
export const useDeleteProjectSupplimentary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectSupplimentary,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_SUPPLIMENTARY_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prs_id !== parseInt(id),
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
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prs_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
