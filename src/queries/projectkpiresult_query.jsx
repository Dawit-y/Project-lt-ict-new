import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectKpiResult,
  updateProjectKpiResult,
  addProjectKpiResult,
  deleteProjectKpiResult,
} from "../helpers/projectkpiresult_backend_helper";

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
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_KPI_RESULT_QUERY_KEY,
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
// Update project_kpi_result
export const useUpdateProjectKpiResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectKpiResult,
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
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete project_kpi_result
export const useDeleteProjectKpiResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectKpiResult,
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
              (deletedData) => deletedData.kpr_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
