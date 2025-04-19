import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProject,
  fetchProject,
  updateProject,
  addProject,
  deleteProject,
  getSearchProject,
  getChildProjects
} from "../helpers/project_backend_helper";

export const PROJECT_QUERY_KEY = ["project"];

// Fetch project
export const useFetchProjects = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, "fetch", param],
    queryFn: () => getProject(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useSearchOnlyProjects = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, "list", param],
    queryFn: () => getSearchProject(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: false
  });
};

// Fetch single project
export const useFetchProject = (id, userId, isActive = false) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, "detail", id, userId],
    queryFn: () => fetchProject(id),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!id && !!userId && isActive,
  });
};

//search project
export const useSearchProjects = (searchParams = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, "search", searchParams],
    queryFn: () => getProject(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//child project
export const useFetchChildProjects = (searchParams = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, "child", searchParams],
    queryFn: () => getChildProjects(searchParams),
    staleTime: 1000 * 60 * 4,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

// Add project
export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
        exact: false,
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
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
        exact: false,
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
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
        exact: false,
      });
    },
  });
};
