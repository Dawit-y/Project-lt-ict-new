import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectCategory,
  updateProjectCategory,
  addProjectCategory,
  deleteProjectCategory,
} from "../helpers/projectcategory_backend_helper";

const PROJECT_CATEGORY_QUERY_KEY = ["projectcategory"];

// Fetch project_category
export const useFetchProjectCategorys = () => {
  return useQuery({
    queryKey: PROJECT_CATEGORY_QUERY_KEY,
    queryFn: () => getProjectCategory(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_category
export const useSearchProjectCategorys = (searchParams = {}) => {  
  return useQuery({
    queryKey: [...PROJECT_CATEGORY_QUERY_KEY, "search", searchParams],
    queryFn: () => getProjectCategory(searchParams),
     staleTime: 1000 * 60 * 5,
    meta: { persist: false },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: true,
  });
};

// Add project_category
export const useAddProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectCategory,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_CATEGORY_QUERY_KEY, (oldData) => {
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

// Update project_category
export const useUpdateProjectCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectCategory,
    onSuccess: (updatedProjectCategory) => {
      queryClient.setQueryData(PROJECT_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectCategoryData) =>
            ProjectCategoryData.pct_id === updatedProjectCategory.data.pct_id
              ? { ...ProjectCategoryData, ...updatedProjectCategory.data }
              : ProjectCategoryData
          ),
        };
      });
    },
  });
};

// Delete project_category
export const useDeleteProjectCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectCategory,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectCategoryData) => ProjectCategoryData.pct_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
