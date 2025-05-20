import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmailTemplate,
  updateEmailTemplate,
  addEmailTemplate,
  deleteEmailTemplate,
} from "../helpers/emailtemplate_backend_helper";

const EMAIL_TEMPLATE_QUERY_KEY = ["emailtemplate"];

// Fetch email_template
export const useFetchEmailTemplates = () => {
  return useQuery({
    queryKey: EMAIL_TEMPLATE_QUERY_KEY,
    queryFn: () => getEmailTemplate(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search email_template
export const useSearchEmailTemplates = (searchParams = {}) => {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATE_QUERY_KEY, searchParams],
    queryFn: () => getEmailTemplate(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add email_template
export const useAddEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmailTemplate,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(EMAIL_TEMPLATE_QUERY_KEY, (oldData) => {
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

// Update email_template
export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmailTemplate,
    onSuccess: (updatedEmailTemplate) => {
      queryClient.setQueryData(EMAIL_TEMPLATE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((EmailTemplateData) =>
            EmailTemplateData.emt_id === updatedEmailTemplate.data.emt_id
              ? { ...EmailTemplateData, ...updatedEmailTemplate.data }
              : EmailTemplateData
          ),
        };
      });
    },
  });
};

// Delete email_template
export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(EMAIL_TEMPLATE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (EmailTemplateData) => EmailTemplateData.emt_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
