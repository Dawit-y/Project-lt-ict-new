import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPlan,
  updateProjectPlan,
  addProjectPlan,
  deleteProjectPlan,
} from "../helpers/projectplan_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_PLAN_QUERY_KEY = ["projectplan"];

// Fetch project_plan
export const useFetchProjectPlans = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_PLAN_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectPlan(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_plan
export const useSearchProjectPlans = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PLAN_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectPlan(searchParams),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_plan
export const useAddProjectPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectPlan,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PLAN_QUERY_KEY,
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
        queryKey: PROJECT_PLAN_QUERY_KEY,
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
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_plan
export const useUpdateProjectPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectPlan,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.pld_id === updatedData.data.pld_id ? { ...d, ...updatedData.data } : d,
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
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.pld_id === updatedData.data.pld_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_plan
export const useDeleteProjectPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectPlan,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.pld_id !== parseInt(id),
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
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.pld_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_PLAN_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
