import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDepartment,
	updateDepartment,
	addDepartment,
	deleteDepartment,
} from "../helpers/department_backend_helper";

const DEPARTMENT_QUERY_KEY = ["departments"];

// Fetch Departments
export const useFetchDepartments = () => {
	return useQuery({
		queryKey: DEPARTMENT_QUERY_KEY,
		queryFn: () => getDepartment(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
};

//search departments
export const useSearchDepartments = (searchParams = {}) => {
	return useQuery({
		queryKey: [...DEPARTMENT_QUERY_KEY, searchParams],
		queryFn: () => getDepartment(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: true,
	});
};

// Add Department
export const useAddDepartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addDepartment,

		onMutate: async (newData) => {
			await queryClient.cancelQueries(DEPARTMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
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

		onSuccess: (newDepartmentResponse) => {
			const newDepartment = {
				...newDepartmentResponse.data,
				...newDepartmentResponse.previledge,
			};

			const queries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.tempId === newDepartment.tempId ? newDepartment : d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DEPARTMENT_QUERY_KEY,
			});
		},
	});
};

// Update Department
export const useUpdateDepartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateDepartment,

		onMutate: async (updatedData) => {
			await queryClient.cancelQueries(DEPARTMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dep_id === updatedData.data.dep_id
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

		onSuccess: (updatedDepartment) => {
			const queries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.map((d) =>
							d.dep_id === updatedDepartment.data.dep_id
								? { ...d, ...updatedDepartment.data }
								: d
						),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DEPARTMENT_QUERY_KEY,
			});
		},
	});
};

// Delete Department
export const useDeleteDepartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDepartment,

		onMutate: async (id) => {
			await queryClient.cancelQueries(DEPARTMENT_QUERY_KEY);

			const previousQueries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
			});

			const previousData = previousQueries.map(([queryKey, oldData]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.dep_id !== parseInt(id)),
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

		onSuccess: (_deletedData, variable) => {
			const queries = queryClient.getQueriesData({
				queryKey: DEPARTMENT_QUERY_KEY,
			});

			queries.forEach(([queryKey]) => {
				queryClient.setQueryData(queryKey, (oldData) => {
					if (!oldData) return;
					return {
						...oldData,
						data: oldData.data.filter((d) => d.dep_id !== parseInt(variable)),
					};
				});
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: DEPARTMENT_QUERY_KEY,
			});
		},
	});
};
