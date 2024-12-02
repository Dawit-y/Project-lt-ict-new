import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExpenditureCode,
  updateExpenditureCode,
  addExpenditureCode,
  deleteExpenditureCode,
} from "../helpers/expenditurecode_backend_helper";

const EXPENDITURE_CODE_QUERY_KEY = ["expenditurecode"];

// Fetch expenditure_code
export const useFetchExpenditureCodes = () => {
  return useQuery({
    queryKey: EXPENDITURE_CODE_QUERY_KEY,
    queryFn: () => getExpenditureCode(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search expenditure_code
export const useSearchExpenditureCodes = (searchParams = {}) => {
  return useQuery({
    queryKey: [...EXPENDITURE_CODE_QUERY_KEY, searchParams],
    queryFn: () => getExpenditureCode(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add expenditure_code
export const useAddExpenditureCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExpenditureCode,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( EXPENDITURE_CODE_QUERY_KEY, (oldData) => {
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

// Update expenditure_code
export const useUpdateExpenditureCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpenditureCode,
    onSuccess: (updatedExpenditureCode) => {
      queryClient.setQueryData(EXPENDITURE_CODE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ExpenditureCodeData) =>
            ExpenditureCodeData.pec_id === updatedExpenditureCode.data.pec_id
              ? { ...ExpenditureCodeData, ...updatedExpenditureCode.data }
              : ExpenditureCodeData
          ),
        };
      });
    },
  });
};

// Delete expenditure_code
export const useDeleteExpenditureCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpenditureCode,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(EXPENDITURE_CODE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ExpenditureCodeData) => ExpenditureCodeData.pec_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
