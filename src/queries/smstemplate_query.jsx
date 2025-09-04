import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getSmsTemplate,
	updateSmsTemplate,
	addSmsTemplate,
	deleteSmsTemplate,
} from "../helpers/smstemplate_backend_helper";

const SMS_TEMPLATE_QUERY_KEY = ["smstemplate"];

// Fetch sms_template
export const useFetchSmsTemplates = () => {
	return useQuery({
		queryKey: SMS_TEMPLATE_QUERY_KEY,
		queryFn: () => getSmsTemplate(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search sms_template
export const useSearchSmsTemplates = (searchParams = {}) => {
	return useQuery({
		queryKey: [...SMS_TEMPLATE_QUERY_KEY, searchParams],
		queryFn: () => getSmsTemplate(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add sms_template
export const useAddSmsTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addSmsTemplate,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(SMS_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, smt_id: tempId };

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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smt_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});
		},
	});
};

// Update sms_template
export const useUpdateSmsTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSmsTemplate,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(SMS_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smt_id === updatedData.smt_id ? { ...d, ...updatedData } : d
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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smt_id === serverData.smt_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});
		},
	});
};

// Delete sms_template
export const useDeleteSmsTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSmsTemplate,

		onMutate: async (id) => {
			await queryClient.cancelQueries(SMS_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smt_id !== parseInt(id)),
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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});
		},
	});
};
