import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPayment,
  updateProjectPayment,
  addProjectPayment,
  deleteProjectPayment,
} from "../helpers/projectpayment_new_backend_helper";

const PROJECT_PAYMENT_QUERY_KEY = ["projectpayment"];

// Fetch project_payment
export const useFetchProjectPayments = () => {
  return useQuery({
    queryKey: PROJECT_PAYMENT_QUERY_KEY,
    queryFn: () => getProjectPayment(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search project_payment
export const useSearchProjectPayments = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROJECT_PAYMENT_QUERY_KEY, searchParams],
    queryFn: () => getProjectPayment(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add project_payment
export const useAddProjectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectPayment,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( PROJECT_PAYMENT_QUERY_KEY, (oldData) => {
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

// Update project_payment
export const useUpdateProjectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPayment,
    onSuccess: (updatedProjectPayment) => {
      queryClient.setQueryData(PROJECT_PAYMENT_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((ProjectPaymentData) =>
            ProjectPaymentData.prp_id === updatedProjectPayment.data.prp_id
              ? { ...ProjectPaymentData, ...updatedProjectPayment.data }
              : ProjectPaymentData
          ),
        };
      });
    },
  });
};

// Delete project_payment
export const useDeleteProjectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPayment,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROJECT_PAYMENT_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProjectPaymentData) => ProjectPaymentData.prp_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
