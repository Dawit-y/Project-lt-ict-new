import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSectorInformation,
  updateSectorInformation,
  addSectorInformation,
  deleteSectorInformation,
} from "../helpers/sectorinformation_backend_helper";

const SECTOR_INFORMATION_QUERY_KEY = ["sectorinformation"];

// Fetch sector_information
export const useFetchSectorInformations = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...SECTOR_INFORMATION_QUERY_KEY, "fetch", param],
    queryFn: () => getSectorInformation(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

// Search sector_information
export const useSearchSectorInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...SECTOR_INFORMATION_QUERY_KEY, "search", searchParams],
    queryFn: () => getSectorInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Object.keys(searchParams).length > 0,
  });
};

// Add sector_information
export const useAddSectorInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSectorInformation,
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: SECTOR_INFORMATION_QUERY_KEY,
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

// Update sector_information
export const useUpdateSectorInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSectorInformation,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: SECTOR_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.sci_id === updatedData.data.sci_id
                ? { ...data, ...updatedData.data }
                : data,
            ),
          };
        });
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
      const queries = queryClient.getQueriesData({
        queryKey: SECTOR_INFORMATION_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (data) => data.sci_id !== parseInt(deletedData.deleted_id),
            ),
          };
        });
      });
    },
  });
};
