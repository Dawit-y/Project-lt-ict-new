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
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.emi_id === updatedData.data.emi_id
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

		onSuccess: (updatedEmailInformation) => {
			const queries = queryClient.getQueriesData({
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((EmailInformationData) =>
							EmailInformationData.emi_id ===
							updatedEmailInformation.data.emi_id
								? { ...EmailInformationData, ...updatedEmailInformation.data }
								: EmailInformationData
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.emi_id !== parseInt(id)),
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
				queryKey: EMAIL_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(EmailInformationData) =>
								EmailInformationData.emi_id !== parseInt(deletedData.deleted_id)
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
