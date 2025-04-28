import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectKpi,
  updateProjectKpi,
  addProjectKpi,
  deleteProjectKpi,
} from "../helpers/projectkpi_backend_helper";

const PROJECT_KPI_QUERY_KEY = ["projectkpi"];
// Fetch project_kpi
export const useFetchProjectKpis = () => {
  return useQuery({
    queryKey: PROJECT_KPI_QUERY_KEY,
    queryFn: () => getProjectKpi(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_QUERY_KEY,
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
// Update project_kpi
export const useUpdateProjectKpi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectKpi,
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
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete project_kpi
export const useDeleteProjectKpi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectKpi,
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
              (deletedData) => deletedData.kpi_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
