import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentCategory,
  updatePaymentCategory,
  addPaymentCategory,
  deletePaymentCategory,
} from "../helpers/paymentcategory_backend_helper";

const PAYMENT_CATEGORY_QUERY_KEY = ["paymentcategory"];

// Fetch payment_category
export const useFetchPaymentCategorys = () => {
  return useQuery({
    queryKey: PAYMENT_CATEGORY_QUERY_KEY,
    queryFn: () => getPaymentCategory(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
//search payment_category
export const useSearchPaymentCategorys = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PAYMENT_CATEGORY_QUERY_KEY, searchParams],
    queryFn: () => getPaymentCategory(searchParams),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
// Add payment_category
export const useAddPaymentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPaymentCategory,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(PAYMENT_CATEGORY_QUERY_KEY, (oldData) => {
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

// Update payment_category
export const useUpdatePaymentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePaymentCategory,
    onSuccess: (updatedPaymentCategory) => {
      queryClient.setQueryData(PAYMENT_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((PaymentCategoryData) =>
            PaymentCategoryData.pyc_id === updatedPaymentCategory.data.pyc_id
              ? { ...PaymentCategoryData, ...updatedPaymentCategory.data }
              : PaymentCategoryData
          ),
        };
      });
    },
  });
};

// Delete payment_category
export const useDeletePaymentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentCategory,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PAYMENT_CATEGORY_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (PaymentCategoryData) => PaymentCategoryData.pyc_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
