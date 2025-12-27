import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageUploadApi, UploadGpaReportResponse, UploadGpaReportRequest } from "./api";

const usePostUploadGpaReport = () => {
  return useMutation<UploadGpaReportResponse, AxiosError, UploadGpaReportRequest>({
    mutationFn: (data) => imageUploadApi.postUploadGpaReport({ data }),
  });
};

export default usePostUploadGpaReport;