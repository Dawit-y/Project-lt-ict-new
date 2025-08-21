import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReport } from "../helpers/report_backend_helper";

const REPORT_QUERY_KEY = ["report"];
// Fetch REPORT_QUERY
export const useSearchReport = (searchParams = {}) => {
  return useQuery({
    queryKey: [...REPORT_QUERY_KEY, searchParams],
    queryFn: () => getReport(searchParams),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: searchParams.length > 0,
  });
};
