import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProjectEmployee,
	updateProjectEmployee,
	addProjectEmployee,
	deleteProjectEmployee,
} from "../helpers/projectemployee_backend_helper";
import { PROJECT_QUERY_KEY } from "./project_query";

const PROJECT_EMPLOYEE_QUERY_KEY = ["projectemployee"];

// Fetch project_employee
export const useFetchProjectEmployees = (param = {}, isActive) => {
	return useQuery({
		queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "fetch", param],
		queryFn: () => getProjectEmployee(param),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: isActive,
	});
};

//search project_employee
export const useSearchProjectEmployees = (searchParams = {}) => {
	return useQuery({
		queryKey: [...PROJECT_EMPLOYEE_QUERY_KEY, "search", searchParams],
		queryFn: () => getProjectEmployee(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		enabled: searchParams.length > 0,
	});
};

// Add project_employee
export const useAddProjectEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addProjectEmployee,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Create a temporary ID for optimistic update
					const tempData = {
						...newData,
						tempId: Date.now(), // Add temporary ID for later matching
						emp_id: `temp-${Date.now()}`, // Temporary ID since we don't have real ID yet
					};

					return {
						...oldData,
						data: [tempData, ...oldData.data], // Add to beginning of array
					};
				});

				return [queryKey, originalData];
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
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					// Replace temporary item with real data from server
					return {
						...oldData,
						data: oldData.data
							.map((item) => (item.tempId ? newData : item))
							.filter(
								(item, index, array) =>
									// Remove duplicates in case of multiple temp items
									!item.tempId ||
									array.findIndex((i) => i.emp_id === item.emp_id) === index
							),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Update project_employee
export const useUpdateProjectEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProjectEmployee,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.emp_id === updatedData.emp_id
								? { ...item, ...updatedData, isOptimistic: true }
								: item
						),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _updatedData, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSuccess: (updatedDataResponse) => {
			const updatedData = {
				...updatedDataResponse.data,
				...updatedDataResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});

			queries.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.emp_id === updatedData.emp_id ? updatedData : item
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};

// Delete project_employee
export const useDeleteProjectEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProjectEmployee,

		onMutate: async (id) => {
			await queryClient.cancelQueries(PROJECT_EMPLOYEE_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				// Store original data for rollback
				const originalData = oldData;

				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData || !Array.isArray(oldData.data)) return oldData;

					return {
						...oldData,
						data: oldData.data.filter((item) => item.emp_id !== parseInt(id)),
					};
				});

				return [queryKey, originalData];
			});

			return { previousData };
		},

		onError: (_err, _id, context) => {
			context?.previousData?.forEach(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, oldData);
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: PROJECT_EMPLOYEE_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
		},
	});
};
