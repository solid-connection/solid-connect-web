import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { reportsApi, ReportResponse, ReportRequest } from "./api";

const usePostReport = () => {
  return useMutation<ReportResponse, AxiosError, ReportRequest>({
    mutationFn: (data) => reportsApi.postReport({ data }),
  });
};

export default usePostReport;