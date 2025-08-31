import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getImplementingArea,
	updateImplementingArea,
	addImplementingArea,
	deleteImplementingArea,
} from "../helpers/implementingarea_backend_helper";

const IMPLEMENTING_AREA_QUERY_KEY = ["implementingarea"];
// Fetch implementing_area
export const useFetchImplementingAreas = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...IMPLEMENTING_AREA_QUERY_KEY, "fetch", param],
		queryFn: () => getImplementingArea(param),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search implementing_area
export const useSearchImplementingAreas = (searchParams = {}) => {
	return useQuery({
		queryKey: [...IMPLEMENTING_AREA_QUERY_KEY, searchParams],
		queryFn: () => getImplementingArea(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};
// Add implementing_area
export const useAddImplementingArea = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addImplementingArea,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(IMPLEMENTING_AREA_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});
		},
	});
};

// Update implementing_area
export const useUpdateImplementingArea = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateImplementingArea,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(IMPLEMENTING_AREA_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pia_id === updatedData.pia_id // Changed from updatedData.data.pia_id
								? { ...d, ...updatedData } // Changed from updatedData.data
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((data) =>
							data.pia_id === updatedData.pia_id // Changed from updatedData.data.pia_id
								? { ...data, ...updatedData } // Changed from updatedData.data
								: data
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});
		},
	});
};

// Delete implementing_area
export const useDeleteImplementingArea = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteImplementingArea,

		onMutate: async (id) => {
			await queryClient.cancelQueries(IMPLEMENTING_AREA_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pia_id !== parseInt(id)),
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pia_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});
		},
	});
};
