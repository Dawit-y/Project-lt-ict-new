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

			const tempId = Date.now();
			const optimisticData = { ...newData, prp_id: tempId };

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: [optimisticData, ...oldData.data],
					};
				});
			});

			return { previousQueries, tempId };
		},

		onError: (_err, _newData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (response, _newData, context) => {
			const serverData = response.data;

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_PAYMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === updatedData.prp_id ? { ...d, ...updatedData } : d
						),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _updatedData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (response) => {
			const serverData = response.data;

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_PAYMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === serverData.prp_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prp_id !== parseInt(id)),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _id, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
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