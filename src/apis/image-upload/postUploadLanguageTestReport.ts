import { AxiosError } from "axios";

import { UploadLanguageTestReportResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadLanguageTestReport = () => {
  return useMutation<UploadLanguageTestReportResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadLanguageTestReport(file),
  });
};

export default usePostUploadLanguageTestReport;
