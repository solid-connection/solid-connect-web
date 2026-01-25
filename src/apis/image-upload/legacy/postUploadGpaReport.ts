import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { imageUploadApi, type UploadGpaReportResponse } from "./api";

const usePostUploadGpaReport = () => {
  return useMutation<UploadGpaReportResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadGpaReport(file),
  });
};

export default usePostUploadGpaReport;
