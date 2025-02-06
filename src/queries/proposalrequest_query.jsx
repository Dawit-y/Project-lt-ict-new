import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProposalRequest,
  updateProposalRequest,
  addProposalRequest,
  deleteProposalRequest,
} from "../helpers/proposalrequest_backend_helper";

const PROPOSAL_REQUEST_QUERY_KEY = ["proposalrequest"];

// Fetch proposal_request
export const useFetchProposalRequests = () => {
  return useQuery({
    queryKey: PROPOSAL_REQUEST_QUERY_KEY,
    queryFn: () => getProposalRequest(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search proposal_request
export const useSearchProposalRequests = (searchParams = {}) => {
  return useQuery({
    queryKey: [...PROPOSAL_REQUEST_QUERY_KEY, searchParams],
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
      queryClient.setQueryData( PROPOSAL_REQUEST_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        const newData = {
          ...newDataResponse.data,
          ...newDataResponse.previledge,
        };
        return {
          ...oldData,
          data: [newData, ...oldData.data],
        };
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
      queryClient.setQueryData(PROPOSAL_REQUEST_QUERY_KEY, (oldData) => {
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
    },
  });
};

// Delete proposal_request
export const useDeleteProposalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProposalRequest,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(PROPOSAL_REQUEST_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (ProposalRequestData) => ProposalRequestData.prr_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
