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

			const tempId = Date.now();
			const optimisticData = { ...newData, emt_id: tempId };

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
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emt_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emt_id === updatedData.emt_id ? { ...d, ...updatedData } : d
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
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emt_id === serverData.emt_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.emt_id !== parseInt(id)),
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
				queryKey: EMAIL_TEMPLATE_QUERY_KEY,
			});
		},
	});
};
