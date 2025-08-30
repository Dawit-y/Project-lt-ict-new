import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getSmsInformation,
	updateSmsInformation,
	addSmsInformation,
	deleteSmsInformation,
} from "../helpers/smsinformation_backend_helper";

const SMS_INFORMATION_QUERY_KEY = ["smsinformation"];

// Fetch sms_information
export const useFetchSmsInformations = () => {
	return useQuery({
		queryKey: SMS_INFORMATION_QUERY_KEY,
		queryFn: () => getSmsInformation(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search sms_information
export const useSearchSmsInformations = (searchParams = {}) => {
	return useQuery({
		queryKey: [...SMS_INFORMATION_QUERY_KEY, searchParams],
		queryFn: () => getSmsInformation(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add sms_information
export const useAddSmsInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addSmsInformation,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(SMS_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_INFORMATION_QUERY_KEY,
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Update sms_information
export const useUpdateSmsInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSmsInformation,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(SMS_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smi_id === updatedData.data.smi_id
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.smi_id === updatedData.data.smi_id
								? { ...data, ...updatedData.data }
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});
		},
	});
};

// Delete sms_information
export const useDeleteSmsInformation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSmsInformation,

		onMutate: async (id) => {
			await queryClient.cancelQueries(SMS_INFORMATION_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smi_id !== parseInt(id)),
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smi_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});
		},
	});
};
