import { AxiosError } from "axios";

import { UploadGpaReportResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadGpaReport = () => {
  return useMutation<UploadGpaReportResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadGpaReport(file),
  });
};

export default usePostUploadGpaReport;
