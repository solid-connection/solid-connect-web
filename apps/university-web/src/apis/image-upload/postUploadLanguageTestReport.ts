import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { imageUploadApi, type UploadLanguageTestReportResponse } from "./api";

const usePostUploadLanguageTestReport = () => {
  return useMutation<UploadLanguageTestReportResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadLanguageTestReport(file),
  });
};

export default usePostUploadLanguageTestReport;
