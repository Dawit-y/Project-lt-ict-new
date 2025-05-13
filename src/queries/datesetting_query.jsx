import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDateSetting,
  updateDateSetting,
  addDateSetting,
  deleteDateSetting,
} from "../helpers/datesetting_backend_helper";

const DATE_SETTING_QUERY_KEY = ["datesetting"];

// Fetch date_setting
export const useFetchDateSettings = () => {
  return useQuery({
    queryKey: DATE_SETTING_QUERY_KEY,
    queryFn: () => getDateSetting(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search date_setting
export const useSearchDateSettings = (searchParams = {}) => {
  return useQuery({
    queryKey: [...DATE_SETTING_QUERY_KEY, searchParams],
    queryFn: () => getDateSetting(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};

// Add date_setting
export const useAddDateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDateSetting,
    onSuccess: (newDataResponse) => {
      queryClient.setQueryData(DATE_SETTING_QUERY_KEY, (oldData) => {
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
// Update date_setting
export const useUpdateDateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDateSetting,
    onSuccess: (updatedDateSetting) => {
      queryClient.setQueryData(DATE_SETTING_QUERY_KEY, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          data: oldData.data.map((DateSettingData) =>
            DateSettingData.dts_id === updatedDateSetting.data.dts_id
              ? { ...DateSettingData, ...updatedDateSetting.data }
              : DateSettingData
          ),
        };
      });
    },
  });
};
// Delete date_setting
export const useDeleteDateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDateSetting,
    onSuccess: (deletedData) => {
      queryClient.setQueryData(DATE_SETTING_QUERY_KEY, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (DateSettingData) => DateSettingData.dts_id !== parseInt(deletedData.deleted_id)
          ),
        };
      });
    },
  });
};
