import { AxiosError } from "axios";

import { UploadLanguageTestReportRequest, UploadLanguageTestReportResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadLanguageTestReport = () => {
  return useMutation<UploadLanguageTestReportResponse, AxiosError, UploadLanguageTestReportRequest>({
    mutationFn: (data) => imageUploadApi.postUploadLanguageTestReport({ data }),
  });
};

export default usePostUploadLanguageTestReport;
