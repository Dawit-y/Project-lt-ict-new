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

			const tempId = Date.now();
			const optimisticData = { ...newData, smi_id: tempId };

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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smi_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smi_id === updatedData.smi_id ? { ...d, ...updatedData } : d
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.smi_id === serverData.smi_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.smi_id !== parseInt(id)),
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
				queryKey: SMS_INFORMATION_QUERY_KEY,
			});
		},
	});
};
