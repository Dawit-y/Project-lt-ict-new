import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCsoInfo,
  updateCsoInfo,
  addCsoInfo,
  deleteCsoInfo,
} from "../helpers/csoinfo_backend_helper";

export const CSO_INFO_QUERY_KEY = ["csoinfo"];

// Fetch cso_info
export const useFetchCsoInfos = () => {
  return useQuery({
    queryKey: CSO_INFO_QUERY_KEY,
    queryFn: () => getCsoInfo(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search cso_info
export const useSearchCsoInfos = (searchParams = {}, enabled) => {
  return useQuery({
    queryKey: [...CSO_INFO_QUERY_KEY, "search", searchParams],
    queryFn: () => getCsoInfo(searchParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled
  });
};


// Add cso_info
export const useAddCsoInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCsoInfo,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries({ queryKey: CSO_INFO_QUERY_KEY, exact: false, refetchType: "all" })
    },
  });
};
// Update cso_info
export const useUpdateCsoInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCsoInfo,
    onSuccess: (updatedCsoInfo) => {
      queryClient.invalidateQueries({ queryKey: CSO_INFO_QUERY_KEY, exact: false, refetchType: "all" })
    },
  });
};
// Delete cso_info
export const useDeleteCsoInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCsoInfo,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries({ queryKey: CSO_INFO_QUERY_KEY, exact: false, refetchType: "all" })
    },
  });
};
