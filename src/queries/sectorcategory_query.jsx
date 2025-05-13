import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSectorCategory,
  updateSectorCategory,
  addSectorCategory,
  deleteSectorCategory,
} from "../helpers/sectorcategory_backend_helper";

const SECTOR_CATEGORY_QUERY_KEY = ["sectorcategory"];

// Fetch sector_category
export const useFetchSectorCategorys = () => {
  return useQuery({
    queryKey: SECTOR_CATEGORY_QUERY_KEY,
    queryFn: () => getSectorCategory(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search sector_category
export const useSearchSectorCategorys = (searchParams = {}) => {
  return useQuery({
    queryKey: [...SECTOR_CATEGORY_QUERY_KEY, searchParams],
    queryFn: () => getSectorCategory(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add sector_category
export const useAddSectorCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSectorCategory,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(SECTOR_CATEGORY_QUERY_KEY, (oldData) => {
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

// Update sector_category
export const useUpdateSectorCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSectorCategory,
    onSuccess: (updatedSectorCategory) => {
      queryClient.setQueryData(SECTOR_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((SectorCategoryData) =>
            SectorCategoryData.psc_id === updatedSectorCategory.data.psc_id
              ? { ...SectorCategoryData, ...updatedSectorCategory.data }
              : SectorCategoryData
          ),
        };
      });
    },
  });
};

// Delete sector_category
export const useDeleteSectorCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSectorCategory,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(SECTOR_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (SectorCategoryData) => SectorCategoryData.psc_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
