import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectSupplimentary,
  updateProjectSupplimentary,
  addProjectSupplimentary,
  deleteProjectSupplimentary,
} from "../helpers/projectsupplimentary_backend_helper";

const PROJECT_SUPPLIMENTARY_QUERY_KEY = ["projectsupplimentary"];

// Fetch project_supplimentary
export const useFetchProjectSupplimentarys = () => {
  return useQuery({
    queryKey: PROJECT_SUPPLIMENTARY_QUERY_KEY,
    queryFn: () => getProjectSupplimentary(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_supplimentary
export const useSearchProjectSupplimentarys = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_SUPPLIMENTARY_QUERY_KEY, searchParams],
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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_SUPPLIMENTARY_QUERY_KEY, (oldData) => {
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

// Update project_supplimentary
export const useUpdateProjectSupplimentary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectSupplimentary,
    onSuccess: (updatedProjectSupplimentary) => {
      queryClient.setQueryData(PROJECT_SUPPLIMENTARY_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectSupplimentaryData) =>
            ProjectSupplimentaryData.prs_id === updatedProjectSupplimentary.data.prs_id
              ? { ...ProjectSupplimentaryData, ...updatedProjectSupplimentary.data }
              : ProjectSupplimentaryData
          ),
        };
      });
    },
  });
};

// Delete project_supplimentary
export const useDeleteProjectSupplimentary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectSupplimentary,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_SUPPLIMENTARY_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectSupplimentaryData) => ProjectSupplimentaryData.prs_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
