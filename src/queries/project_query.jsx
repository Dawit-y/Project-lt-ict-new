import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProject,
  updateProject,
  addProject,
  deleteProject,
} from "../helpers/project_backend_helper";

const PROJECT_QUERY_KEY = ["project"];

// Fetch project
export const useFetchProjects = () => {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: () => getProject(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project
export const useSearchProjects = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, searchParams],
    queryFn: () => getProject(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project
export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_QUERY_KEY, (oldData) => {
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

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(PROJECT_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectData) =>
            ProjectData.prj_id === updatedProject.data.prj_id
              ? { ...ProjectData, ...updatedProject.data }
              : ProjectData
          ),
        };
      });
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectData) => ProjectData.prj_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
