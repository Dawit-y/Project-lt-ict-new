import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStakeholderType,
  updateStakeholderType,
  addStakeholderType,
  deleteStakeholderType,
} from "../helpers/stakeholdertype_backend_helper";

const STAKEHOLDER_TYPE_QUERY_KEY = ["stakeholdertype"];

// Fetch stakeholder_type
export const useFetchStakeholderTypes = () => {
  return useQuery({
    queryKey: STAKEHOLDER_TYPE_QUERY_KEY,
    queryFn: () => getStakeholderType(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search stakeholder_type
export const useSearchStakeholderTypes = (searchParams = {}) => {
  return useQuery({
    queryKey: [...STAKEHOLDER_TYPE_QUERY_KEY, searchParams],
    queryFn: () => getStakeholderType(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add stakeholder_type
export const useAddStakeholderType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStakeholderType,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( STAKEHOLDER_TYPE_QUERY_KEY, (oldData) => {
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

// Update stakeholder_type
export const useUpdateStakeholderType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStakeholderType,
    onSuccess: (updatedStakeholderType) => {
      queryClient.setQueryData(STAKEHOLDER_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((StakeholderTypeData) =>
            StakeholderTypeData.sht_id === updatedStakeholderType.data.sht_id
              ? { ...StakeholderTypeData, ...updatedStakeholderType.data }
              : StakeholderTypeData
          ),
        };
      });
    },
  });
};

// Delete stakeholder_type
export const useDeleteStakeholderType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStakeholderType,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(STAKEHOLDER_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (StakeholderTypeData) => StakeholderTypeData.sht_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
