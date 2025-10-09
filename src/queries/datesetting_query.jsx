import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDateSetting,
	updateDateSetting,
	addDateSetting,
	deleteDateSetting,
} from "../helpers/datesetting_backend_helper";

const DATE_SETTING_QUERY_KEY = ["datesetting"];

// Fetch date_setting
export const useFetchDateSettings = () => {
	return useQuery({
		queryKey: DATE_SETTING_QUERY_KEY,
		queryFn: () => getDateSetting(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search date_setting
export const useSearchDateSettings = (searchParams = {}) => {
	return useQuery({
		queryKey: [...DATE_SETTING_QUERY_KEY, searchParams],
		queryFn: () => getDateSetting(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: searchParams.length > 0,
	});
};

// Add date_setting
export const useAddDateSetting = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addDateSetting,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(DATE_SETTING_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, dts_id: tempId };

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
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dts_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DATE_SETTING_QUERY_KEY,
			});
		},
	});
};

// Update date_setting
export const useUpdateDateSetting = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateDateSetting,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(DATE_SETTING_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dts_id === updatedData.dts_id ? { ...d, ...updatedData } : d
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
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dts_id === serverData.dts_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DATE_SETTING_QUERY_KEY,
			});
		},
	});
};

// Delete date_setting
export const useDeleteDateSetting = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDateSetting,

		onMutate: async (id) => {
			await queryClient.cancelQueries(DATE_SETTING_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.dts_id !== parseInt(id)),
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
				queryKey: DATE_SETTING_QUERY_KEY,
			});
		},
	});
};
