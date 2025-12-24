import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostUploadLanguageTestReportRequest {
  // TODO: Define request type
}

export interface PostUploadLanguageTestReportResponse {
  fileUrl: string;
}

const postUploadLanguageTestReport = async (params: { data?: PostUploadLanguageTestReportRequest }): Promise<PostUploadLanguageTestReportResponse> => {
  const res = await axiosInstance.post<PostUploadLanguageTestReportResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostUploadLanguageTestReport = () => {
  return useMutation<PostUploadLanguageTestReportResponse, AxiosError, PostUploadLanguageTestReportRequest>({
    mutationFn: (data) => postUploadLanguageTestReport({ data }),
  });
};

export default usePostUploadLanguageTestReport;