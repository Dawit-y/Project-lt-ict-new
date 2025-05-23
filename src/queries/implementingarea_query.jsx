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
    onSuccess: (newDataResponse) => {
      const queries = queryClient.getQueriesData({
        queryKey: IMPLEMENTING_AREA_QUERY_KEY,
      });

      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: [newData, ...oldData.data],
          };
        });
      });
    },
  });
};
// Update implementing_area
export const useUpdateImplementingArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateImplementingArea,
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
              data.pia_id === updatedData.data.pia_id
                ? { ...data, ...updatedData.data }
                : data
            ),
          };
        });
      });
    },
  });
};
// Delete implementing_area
export const useDeleteImplementingArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImplementingArea,
    onSuccess: (deletedData, variable) => {
      const queries = queryClient.getQueriesData({
        queryKey: IMPLEMENTING_AREA_QUERY_KEY,
      });

      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (deletedData) =>
                deletedData.pia_id !== parseInt(deletedData.deleted_id)
            ),
          };
        });
      });
    },
  });
};
