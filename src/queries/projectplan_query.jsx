import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectPlan,
	updateProjectPlan,
	addProjectPlan,
	deleteProjectPlan,
} from "../helpers/projectplan_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_PLAN_QUERY_KEY = ["projectplan"];

// Fetch project_plan
export const useFetchProjectPlans = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_PLAN_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectPlan(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_plan
export const useSearchProjectPlans = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_PLAN_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectPlan(searchParams),
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_plan
export const useAddProjectPlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectPlan,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});

			const tempId = Date.now();
			const optimisticData = { ...newData, pld_id: tempId };

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
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pld_id === context.tempId ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_plan
export const useUpdateProjectPlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectPlan,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pld_id === updatedData.pld_id ? { ...d, ...updatedData } : d
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
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.pld_id === serverData.pld_id ? serverData : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_plan
export const useDeleteProjectPlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectPlan,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_PLAN_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});

			previousQueries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.pld_id !== parseInt(id)),
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
				queryKey: PROJECT_PLAN_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
