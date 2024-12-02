import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContractorType,
  updateContractorType,
  addContractorType,
  deleteContractorType,
} from "../helpers/contractortype_backend_helper";

const CONTRACTOR_TYPE_QUERY_KEY = ["contractortype"];

// Fetch contractor_type
export const useFetchContractorTypes = () => {
  return useQuery({
    queryKey: CONTRACTOR_TYPE_QUERY_KEY,
    queryFn: () => getContractorType(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search contractor_type
export const useSearchContractorTypes = (searchParams = {}) => {
  return useQuery({
    queryKey: [...CONTRACTOR_TYPE_QUERY_KEY, searchParams],
    queryFn: () => getContractorType(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add contractor_type
export const useAddContractorType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContractorType,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( CONTRACTOR_TYPE_QUERY_KEY, (oldData) => {
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

// Update contractor_type
export const useUpdateContractorType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContractorType,
    onSuccess: (updatedContractorType) => {
      queryClient.setQueryData(CONTRACTOR_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ContractorTypeData) =>
            ContractorTypeData.cnt_id === updatedContractorType.data.cnt_id
              ? { ...ContractorTypeData, ...updatedContractorType.data }
              : ContractorTypeData
          ),
        };
      });
    },
  });
};

// Delete contractor_type
export const useDeleteContractorType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContractorType,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(CONTRACTOR_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ContractorTypeData) => ContractorTypeData.cnt_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
