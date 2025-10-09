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

			const tempId = Date.now();
			const optimisticData = { ...newData, pia_id: tempId };

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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pia_id === context.tempId ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pia_id === updatedData.pia_id ? { ...d, ...updatedData } : d
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pia_id === serverData.pia_id ? serverData : d
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

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pia_id !== parseInt(id)),
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
				queryKey: IMPLEMENTING_AREA_QUERY_KEY,
			});
		},
	});
};
