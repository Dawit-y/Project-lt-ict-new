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
				queryKey: DATE_SETTING_QUERY_KEY,
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dts_id === updatedData.data.dts_id
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

		onSuccess: (updatedDateSetting) => {
			const queries = queryClient.getQueriesData({
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((DateSettingData) =>
							DateSettingData.dts_id === updatedDateSetting.data.dts_id
								? { ...DateSettingData, ...updatedDateSetting.data }
								: DateSettingData
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

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.dts_id !== parseInt(id)),
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
				queryKey: DATE_SETTING_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter(
							(DateSettingData) =>
								DateSettingData.dts_id !== parseInt(deletedData.deleted_id)
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
