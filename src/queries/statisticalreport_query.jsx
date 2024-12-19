import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatisticalReport,
} from "../helpers/statisticalreport_backend_helper";
const STATISTICAL_REPORT_QUERY_KEY = ["projectcontractor"];
// Fetch STATISTICAL_REPORT


export const useSearchStatisticalReport = (searchParams = {}) => {
  return useQuery({
    queryKey: [...STATISTICAL_REPORT_QUERY_KEY, searchParams],
    queryFn: () => getStatisticalReport(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};