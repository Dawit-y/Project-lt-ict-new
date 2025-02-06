import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProposalRequest,
  updateProposalRequest,
  addProposalRequest,
  deleteProposalRequest,
} from "../helpers/proposalrequest_backend_helper";

const PROPOSAL_REQUEST_QUERY_KEY = ["proposalrequest"];

// Fetch proposal_request
export const useFetchProposalRequests = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...PROPOSAL_REQUEST_QUERY_KEY, "fetch", param],
    queryFn: () => getProposalRequest(param),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isActive,
  });
};

//search proposal_request
export const useSearchProposalRequests = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROPOSAL_REQUEST_QUERY_KEY, "search", searchParams],
    queryFn: () => getProposalRequest(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add proposal_request
export const useAddProposalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProposalRequest,
    onSuccess: (newDataResponse) => {
      // Get all queries matching the PROPOSAL_REQUEST_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: PROPOSAL_REQUEST_QUERY_KEY,
      });

      // Prepare the new data to be added
      const newData = {
        ...newDataResponse.data,
        ...newDataResponse.previledge,
      };

      // Update each query's cached data
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
// Update proposal_request
export const useUpdateProposalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProposalRequest,
    onSuccess: (updatedProposalRequest) => {
      // Get all queries matching the PROPOSAL_REQUEST_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: PROPOSAL_REQUEST_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.map((ProposalRequestData) =>
              ProposalRequestData.prr_id === updatedProposalRequest.data.prr_id
                ? { ...ProposalRequestData, ...updatedProposalRequest.data }
                : ProposalRequestData
            ),
          };
        });
      });
    },
  });
};
export const useDeleteProposalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProposalRequest,
    onSuccess: (deletedData, variable) => {
      // Get all queries matching the PROPOSAL_REQUEST_QUERY_KEY
      const queries = queryClient.getQueriesData({
        queryKey: PROPOSAL_REQUEST_QUERY_KEY,
      });

      // Update each query's cached data
      queries.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            data: oldData.data.filter(
              (ProposalRequestData) =>
                ProposalRequestData.prr_id !== parseInt(variable)
            ),
          };
        });
      });
    },
  });
};
