import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPayment,
  updateProjectPayment,
  addProjectPayment,
  deleteProjectPayment,
} from "../helpers/projectpayment_new_backend_helper";

const PROJECT_PAYMENT_QUERY_KEY = ["projectpayment"];

// Fetch project_payment
export const useFetchProjectPayments = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_PAYMENT_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectPayment(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
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
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
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

// Update project_payment
export const useUpdateProjectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectPayment,
    onSuccess: (updatedData) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((data) =>
              data.prp_id === updatedData.data.prp_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};

// Delete project_payment
export const useDeleteProjectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectPayment,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prp_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
