import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageUploadApi, UploadLanguageTestReportResponse, UploadLanguageTestReportRequest } from "./api";

const usePostUploadLanguageTestReport = () => {
  return useMutation<UploadLanguageTestReportResponse, AxiosError, UploadLanguageTestReportRequest>({
    mutationFn: (data) => imageUploadApi.postUploadLanguageTestReport({ data }),
  });
};

export default usePostUploadLanguageTestReport;