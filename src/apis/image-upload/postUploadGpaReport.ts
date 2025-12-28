import { AxiosError } from "axios";

import { UploadGpaReportRequest, UploadGpaReportResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadGpaReport = () => {
  return useMutation<UploadGpaReportResponse, AxiosError, UploadGpaReportRequest>({
    mutationFn: (data) => imageUploadApi.postUploadGpaReport({ data }),
  });
};

export default usePostUploadGpaReport;
