import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectKpi,
  updateProjectKpi,
  addProjectKpi,
  deleteProjectKpi,
} from "../helpers/projectkpi_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_KPI_QUERY_KEY = ["projectkpi"];
// Fetch project_kpi
export const useFetchProjectKpis = () => {
  return useQuery({
    queryKey: PROJECT_KPI_QUERY_KEY,
    queryFn: () => getProjectKpi(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search project_kpi
export const useSearchProjectKpis = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_KPI_QUERY_KEY, searchParams],
    queryFn: () => getProjectKpi(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
// Add project_kpi
export const useAddProjectKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectKpi,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_QUERY_KEY,
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
        queryKey: PROJECT_KPI_QUERY_KEY,
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
        queryKey: PROJECT_KPI_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Update project_kpi
export const useUpdateProjectKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectKpi,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.kpi_id === updatedData.data.kpi_id ? { ...d, ...updatedData.data } : d,
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
        queryKey: PROJECT_KPI_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.kpi_id === updatedData.data.kpi_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_KPI_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Delete project_kpi
export const useDeleteProjectKpi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectKpi,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_KPI_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.kpi_id !== parseInt(id),
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
        queryKey: PROJECT_KPI_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.kpi_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_KPI_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
