import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmailInformation,
  updateEmailInformation,
  addEmailInformation,
  deleteEmailInformation,
} from "../helpers/emailinformation_backend_helper";

const EMAIL_INFORMATION_QUERY_KEY = ["emailinformation"];

// Fetch email_information
export const useFetchEmailInformations = () => {
  return useQuery({
    queryKey: EMAIL_INFORMATION_QUERY_KEY,
    queryFn: () => getEmailInformation(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search email_information
export const useSearchEmailInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...EMAIL_INFORMATION_QUERY_KEY, searchParams],
    queryFn: () => getEmailInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add email_information
export const useAddEmailInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmailInformation,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( EMAIL_INFORMATION_QUERY_KEY, (oldData) => {
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

// Update email_information
export const useUpdateEmailInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmailInformation,
    onSuccess: (updatedEmailInformation) => {
      queryClient.setQueryData(EMAIL_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((EmailInformationData) =>
            EmailInformationData.emi_id === updatedEmailInformation.data.emi_id
              ? { ...EmailInformationData, ...updatedEmailInformation.data }
              : EmailInformationData
          ),
        };
      });
    },
  });
};

// Delete email_information
export const useDeleteEmailInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmailInformation,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(EMAIL_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (EmailInformationData) => EmailInformationData.emi_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
