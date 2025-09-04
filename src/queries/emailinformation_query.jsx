import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getEmailInformation,
	updateEmailInformation,
	addEmailInformation,
	deleteEmailInformation,
} from "../helpers/emailinformation_backend_helper";

const EMAIL_INFORMATION_QUERY_KEY = ["emailinformation"];

// Fetch email_information
export const useFetchEmailInformations = () => {
	return useQuery({
		queryKey: EMAIL_INFORMATION_QUERY_KEY,
		queryFn: () => getEmailInformation(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search email_information
export const useSearchEmailInformations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...EMAIL_INFORMATION_QUERY_KEY, searchParams],
		queryFn: () => getEmailInformation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add email_information
export const useAddEmailInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addEmailInformation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(EMAIL_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, emi_id: tempId };

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
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emi_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Update email_information
export const useUpdateEmailInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateEmailInformation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(EMAIL_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emi_id === updatedData.emi_id ? { ...d, ...updatedData } : d
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
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emi_id === serverData.emi_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Delete email_information
export const useDeleteEmailInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEmailInformation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(EMAIL_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.emi_id !== parseInt(id)),
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
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});
		},
	});
};
