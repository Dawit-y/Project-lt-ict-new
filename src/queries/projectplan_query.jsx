import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPlan,
  updateProjectPlan,
  addProjectPlan,
  deleteProjectPlan,
} from "../helpers/projectplan_backend_helper";

const PROJECT_PLAN_QUERY_KEY = ["projectplan"];

// Fetch project_plan
export const useFetchProjectPlans = () => {
  return useQuery({
    queryKey: PROJECT_PLAN_QUERY_KEY,
    queryFn: () => getProjectPlan(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_plan
export const useSearchProjectPlans = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PLAN_QUERY_KEY, searchParams],
    queryFn: () => getProjectPlan(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_PLAN_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        const newData = {
          ...newDataResponse.data,
          ...newDataResponse.previledge,
        };
        return {
          ...oldData,
          data: [newData, ...oldData.data],
        };
      });
    },
  });
};

// Update project_plan
export const useUpdateProjectPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPlan,
    onSuccess: (updatedProjectPlan) => {
      queryClient.setQueryData(PROJECT_PLAN_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectPlanData) =>
            ProjectPlanData.pld_id === updatedProjectPlan.data.pld_id
              ? { ...ProjectPlanData, ...updatedProjectPlan.data }
              : ProjectPlanData
          ),
        };
      });
    },
  });
};

// Delete project_plan
export const useDeleteProjectPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPlan,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_PLAN_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectPlanData) => ProjectPlanData.pld_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
