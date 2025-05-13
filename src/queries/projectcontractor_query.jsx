import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectContractor,
  updateProjectContractor,
  addProjectContractor,
  deleteProjectContractor,
} from "../helpers/projectcontractor_backend_helper";

const PROJECT_CONTRACTOR_QUERY_KEY = ["projectcontractor"];

// Fetch project_contractor
export const useFetchProjectContractors = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_CONTRACTOR_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectContractor(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

//search project_contractor
export const useSearchProjectContractors = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_CONTRACTOR_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectContractor(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_contractor
export const useAddProjectContractor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectContractor,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(PROJECT_CONTRACTOR_QUERY_KEY, (oldData) => {
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

// Update project_contractor
export const useUpdateProjectContractor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectContractor,
    onSuccess: (updatedProjectContractor) => {
      queryClient.setQueryData(PROJECT_CONTRACTOR_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectContractorData) =>
            ProjectContractorData.cni_id === updatedProjectContractor.data.cni_id
              ? { ...ProjectContractorData, ...updatedProjectContractor.data }
              : ProjectContractorData
          ),
        };
      });
    },
  });
};

// Delete project_contractor
export const useDeleteProjectContractor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectContractor,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_CONTRACTOR_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectContractorData) => ProjectContractorData.cni_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
