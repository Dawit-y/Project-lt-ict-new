import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectPlanDetail,
	updateProjectPlanDetail,
	addProjectPlanDetail,
	deleteProjectPlanDetail,
} from "../helpers/projectplan_detail_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_PLAN_DETAIL_QUERY_KEY = ["projectplandetail"];

// Fetch project_plan_detail
export const useFetchProjectPlanDetails = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_PLAN_DETAIL_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectPlanDetail(param),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

// Search project_plan_detail
export const useSearchProjectPlanDetails = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_PLAN_DETAIL_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectPlanDetail(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: Object.keys(searchParams).length > 0,
	});
};

// Add project_plan_detail
export const useAddProjectPlanDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectPlanDetail,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_PLAN_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, prp_id: tempId };

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
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_plan_detail
export const useUpdateProjectPlanDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectPlanDetail,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_PLAN_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.prp_id === updatedData.prp_id ? { ...d, ...updatedData } : d
						),
					};
				});
			});

			return { previousQueries };
		},

		onError: (_err, _newData, context) => {
			context?.previousQueries?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_plan_detail
export const useDeleteProjectPlanDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectPlanDetail,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_PLAN_DETAIL_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.prp_id !== parseInt(id)),
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
				queryKey: PROJECT_PLAN_DETAIL_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
