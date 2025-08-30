import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectPayment,
  updateProjectPayment,
  addProjectPayment,
  deleteProjectPayment,
} from "../helpers/projectpayment_new_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_PAYMENT_QUERY_KEY = ["projectpayment"];

// Fetch project_payment
export const useFetchProjectPayments = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROJECT_PAYMENT_QUERY_KEY, "fetch", param],
    queryFn: () => getProjectPayment(param),
    staleTime: 0,
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries(PROJECT_PAYMENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _newData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSuccess: (newDataResponse) => {
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      const queries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.tempId === newData.tempId ? newData : d,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Update project_payment
export const useUpdateProjectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectPayment,

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(PROJECT_PAYMENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((d) =>
              d.prp_id === updatedData.data.prp_id ? { ...d, ...updatedData.data } : d,
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _updatedData, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
                : data,
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

// Delete project_payment
export const useDeleteProjectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectPayment,

    onMutate: async (id) => {
      await queryClient.cancelQueries(PROJECT_PAYMENT_QUERY_KEY);

      const previousQueries = queryClient.getQueriesData({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });

      const previousData = previousQueries.map(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (dept) => dept.prp_id !== parseInt(id),
            ),
          };
        });
        return [queryKey, oldData];
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

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
              (dept) => dept.prp_id !== parseInt(variable),
            ),
          };
        });
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_PAYMENT_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
