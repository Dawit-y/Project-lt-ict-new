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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.tempId === newData.tempId ? newData : d
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smt_id === updatedData.data.smt_id
								? { ...d, ...updatedData.data }
								: d
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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.smt_id === updatedData.data.smt_id
								? { ...data, ...updatedData.data }
								: data
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smt_id !== parseInt(id)),
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
				queryKey: SMS_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smt_id !== parseInt(variable)),
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
