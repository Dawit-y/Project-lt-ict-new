import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSmsTemplate,
  updateSmsTemplate,
  addSmsTemplate,
  deleteSmsTemplate,
} from "../helpers/smstemplate_backend_helper";

const SMS_TEMPLATE_QUERY_KEY = ["smstemplate"];

// Fetch sms_template
export const useFetchSmsTemplates = () => {
  return useQuery({
    queryKey: SMS_TEMPLATE_QUERY_KEY,
    queryFn: () => getSmsTemplate(),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

//search sms_template
export const useSearchSmsTemplates = (searchParams = {}) => {
  return useQuery({
    queryKey: [...SMS_TEMPLATE_QUERY_KEY, searchParams],
    queryFn: () => getSmsTemplate(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add sms_template
export const useAddSmsTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSmsTemplate,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData( SMS_TEMPLATE_QUERY_KEY, (oldData) => {
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

// Update sms_template
export const useUpdateSmsTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSmsTemplate,
    onSuccess: (updatedSmsTemplate) => {
      queryClient.setQueryData(SMS_TEMPLATE_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((SmsTemplateData) =>
            SmsTemplateData.smt_id === updatedSmsTemplate.data.smt_id
              ? { ...SmsTemplateData, ...updatedSmsTemplate.data }
              : SmsTemplateData
          ),
        };
      });
    },
  });
};

// Delete sms_template
export const useDeleteSmsTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSmsTemplate,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(SMS_TEMPLATE_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (SmsTemplateData) => SmsTemplateData.smt_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
