import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProgramInfo,
  getProgramTree,
  updateProgramInfo,
  addProgramInfo,
  deleteProgramInfo,
} from "../helpers/programinfo_backend_helper";

const PROGRAM_INFO_QUERY_KEY = ["programinfo"];

// Fetch program_info
export const useFetchProgramInfos = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROGRAM_INFO_QUERY_KEY, "fetch", param],
    queryFn: () => getProgramInfo(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};
export const useFetchProgramTree = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROGRAM_INFO_QUERY_KEY, "tree", param],
    queryFn: () => getProgramTree(param),
    staleTime: 0,
    gcTime: 1000 * 60 * 7,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

// Search program_info
export const useSearchProgramInfos = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROGRAM_INFO_QUERY_KEY, "search", searchParams],
    queryFn: () => getProgramInfo(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add program_info
export const useAddProgramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProgramInfo,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [...PROGRAM_INFO_QUERY_KEY],
        refetchType: "all",
      });
    },
  });
};

// Update program_info
export const useUpdateProgramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgramInfo,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [...PROGRAM_INFO_QUERY_KEY],
        refetchType: "all",
      });
    },
  });
};

// Delete program_info
export const useDeleteProgramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgramInfo,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: PROGRAM_INFO_QUERY_KEY,
        exact: false,
      });
    },
  });
};
