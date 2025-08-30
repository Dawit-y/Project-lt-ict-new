import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectKpiResult,
  updateProjectKpiResult,
  addProjectKpiResult,
  deleteProjectKpiResult,
} from "../helpers/projectkpiresult_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_KPI_RESULT_QUERY_KEY = ["projectkpiresult"];
// Fetch project_kpi_result
export const useFetchProjectKpiResults = () => {
  return useQuery({
    queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
    queryFn: () => getProjectKpiResult(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search project_kpi_result
export const useSearchProjectKpiResults = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_KPI_RESULT_QUERY_KEY, searchParams],
    queryFn: () => getProjectKpiResult(searchParams),
    staleTime: 1000 * 60 * 2,
    //gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: false,
  });
};
// Add project_kpi_result
export const useAddProjectKpiResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectKpiResult,

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
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
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
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
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Update project_kpi_result
export const useUpdateProjectKpiResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectKpiResult,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.kpr_id === updatedData.data.kpr_id ? { ...d, ...updatedData.data } : d,
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
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.kpr_id === updatedData.data.kpr_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
// Delete project_kpi_result
export const useDeleteProjectKpiResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectKpiResult,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_KPI_RESULT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.kpr_id !== parseInt(id),
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
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.kpr_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
