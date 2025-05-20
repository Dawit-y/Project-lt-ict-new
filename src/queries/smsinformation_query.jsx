import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSmsInformation,
  updateSmsInformation,
  addSmsInformation,
  deleteSmsInformation,
} from "../helpers/smsinformation_backend_helper";

const SMS_INFORMATION_QUERY_KEY = ["smsinformation"];

// Fetch sms_information
export const useFetchSmsInformations = () => {
  return useQuery({
    queryKey: SMS_INFORMATION_QUERY_KEY,
    queryFn: () => getSmsInformation(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search sms_information
export const useSearchSmsInformations = (searchParams = {}) => {
  return useQuery({
    queryKey: [...SMS_INFORMATION_QUERY_KEY, searchParams],
    queryFn: () => getSmsInformation(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};

// Add sms_information
export const useAddSmsInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSmsInformation,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(SMS_INFORMATION_QUERY_KEY, (oldData) => {
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

// Update sms_information
export const useUpdateSmsInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSmsInformation,
    onSuccess: (updatedSmsInformation) => {
      queryClient.setQueryData(SMS_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((SmsInformationData) =>
            SmsInformationData.smi_id === updatedSmsInformation.data.smi_id
              ? { ...SmsInformationData, ...updatedSmsInformation.data }
              : SmsInformationData
          ),
        };
      });
    },
  });
};

// Delete sms_information
export const useDeleteSmsInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSmsInformation,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(SMS_INFORMATION_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (SmsInformationData) => SmsInformationData.smi_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
