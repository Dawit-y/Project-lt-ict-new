import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	populateCsoReport,
	getCsoReport,
	updateCsoReport,
	addCsoReport,
	deleteCsoReport,
} from "../helpers/cso_report_backend_helper";

const CSO_REPORT_QUERY_KEY = ["csoreport"];

// Fetch cso_report
export const useFetchCsoReports = () => {
	return useQuery({
		queryKey: CSO_REPORT_QUERY_KEY,
		queryFn: () => getCsoReport(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

// Search cso_report
export const useSearchCsoReports = (searchParams = {}, isActive) => {
	return useQuery({
		queryKey: [...CSO_REPORT_QUERY_KEY, searchParams],
		queryFn: () => getCsoReport(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: Object.keys(searchParams).length > 0 && isActive,
	});
};

// For populating dropdown
export const usePopulateCsoReports = (searchParams = {}) => {
	return useQuery({
		queryKey: [...CSO_REPORT_QUERY_KEY, searchParams],
		queryFn: () => populateCsoReport(searchParams),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

// Add cso_report
export const useAddCsoReport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addCsoReport,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(CSO_REPORT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_REPORT_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, rpt_id: tempId };

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
				queryKey: CSO_REPORT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rpt_id === context.tempId ? serverData : d,
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_REPORT_QUERY_KEY,
			});
		},
	});
};

// Update cso_report
export const useUpdateCsoReport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCsoReport,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(CSO_REPORT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_REPORT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rpt_id === updatedData.rpt_id ? { ...d, ...updatedData } : d,
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
				queryKey: CSO_REPORT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.rpt_id === serverData.rpt_id ? serverData : d,
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: CSO_REPORT_QUERY_KEY,
			});
		},
	});
};

// Delete cso_report
export const useDeleteCsoReport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCsoReport,

		onMutate: async (id) => {
			await queryClient.cancelQueries(CSO_REPORT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: CSO_REPORT_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.rpt_id !== parseInt(id)),
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
				queryKey: CSO_REPORT_QUERY_KEY,
			});
		},
	});
};
