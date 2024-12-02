import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSectorInformation,
  updateSectorInformation,
  addSectorInformation,
  deleteSectorInformation,
} from "../helpers/sectorinformation_backend_helper";

const SECTOR_INFORMATION_QUERY_KEY = ["sectorinformation"];

// Fetch sector_information
export const useFetchSectorInformations = () => {
  return useQuery({
    queryKey: SECTOR_INFORMATION_QUERY_KEY,
    queryFn: () => getSectorInformation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search sector_information
export const useSearchSectorInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...SECTOR_INFORMATION_QUERY_KEY, searchParams],
    queryFn: () => getSectorInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add sector_information
export const useAddSectorInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSectorInformation,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( SECTOR_INFORMATION_QUERY_KEY, (oldData) => {
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

// Update sector_information
export const useUpdateSectorInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSectorInformation,
    onSuccess: (updatedSectorInformation) => {
      queryClient.setQueryData(SECTOR_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((SectorInformationData) =>
            SectorInformationData.sci_id === updatedSectorInformation.data.sci_id
              ? { ...SectorInformationData, ...updatedSectorInformation.data }
              : SectorInformationData
          ),
        };
      });
    },
  });
};

// Delete sector_information
export const useDeleteSectorInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSectorInformation,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(SECTOR_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (SectorInformationData) => SectorInformationData.sci_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
