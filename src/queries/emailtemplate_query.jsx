import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getEmailTemplate,
	updateEmailTemplate,
	addEmailTemplate,
	deleteEmailTemplate,
} from "../helpers/emailtemplate_backend_helper";

const EMAIL_TEMPLATE_QUERY_KEY = ["emailtemplate"];

// Fetch email_template
export const useFetchEmailTemplates = () => {
	return useQuery({
		queryKey: EMAIL_TEMPLATE_QUERY_KEY,
		queryFn: () => getEmailTemplate(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

//search email_template
export const useSearchEmailTemplates = (searchParams = {}) => {
	return useQuery({
		queryKey: [...EMAIL_TEMPLATE_QUERY_KEY, searchParams],
		queryFn: () => getEmailTemplate(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};
// Add email_template
export const useAddEmailTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEmailTemplate,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(EMAIL_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
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
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
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
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});
		},
	});
};

// Update email_template
export const useUpdateEmailTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateEmailTemplate,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(EMAIL_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emt_id === updatedData.data.emt_id
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

		onSuccess: (updatedEmailTemplate) => {
			const queries = queryClient.getQueriesData({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((EmailTemplateData) =>
							EmailTemplateData.emt_id === updatedEmailTemplate.data.emt_id
								? { ...EmailTemplateData, ...updatedEmailTemplate.data }
								: EmailTemplateData
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});
		},
	});
};

// Delete email_template
export const useDeleteEmailTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEmailTemplate,

		onMutate: async (id) => {
			await queryClient.cancelQueries(EMAIL_TEMPLATE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.emt_id !== parseInt(id)),
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

		onSuccess: (deletedData) => {
			const queries = queryClient.getQueriesData({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(EmailTemplateData) =>
								EmailTemplateData.emt_id !== parseInt(deletedData.deleted_id)
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});
		},
	});
};
