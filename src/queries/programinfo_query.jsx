import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProgramInfo,
  updateProgramInfo,
  addProgramInfo,
  deleteProgramInfo,
} from "../helpers/programinfo_backend_helper";

const PROGRAM_INFO_QUERY_KEY = ["programinfo"];

// Fetch program_info
export const useFetchProgramInfos = () => {
  return useQuery({
    queryKey: PROGRAM_INFO_QUERY_KEY,
    queryFn: () => getProgramInfo(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search program_info
export const useSearchProgramInfos = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROGRAM_INFO_QUERY_KEY, searchParams],
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
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROGRAM_INFO_QUERY_KEY, (oldData) => {
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
// Update program_info
export const useUpdateProgramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgramInfo,
    onSuccess: (updatedProgramInfo) => {
      queryClient.setQueryData(PROGRAM_INFO_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProgramInfoData) =>
            ProgramInfoData.pri_id === updatedProgramInfo.data.pri_id
              ? { ...ProgramInfoData, ...updatedProgramInfo.data }
              : ProgramInfoData
          ),
        };
      });
    },
  });
};
// Delete program_info
export const useDeleteProgramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgramInfo,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROGRAM_INFO_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProgramInfoData) => ProgramInfoData.pri_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
