import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostUploadGpaReportRequest {
  // TODO: Define request type
}

export interface PostUploadGpaReportResponse {
  fileUrl: string;
}

const postUploadGpaReport = async (params: { data?: PostUploadGpaReportRequest }): Promise<PostUploadGpaReportResponse> => {
  const res = await axiosInstance.post<PostUploadGpaReportResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostUploadGpaReport = () => {
  return useMutation<PostUploadGpaReportResponse, AxiosError, PostUploadGpaReportRequest>({
    mutationFn: (data) => postUploadGpaReport({ data }),
  });
};

export default usePostUploadGpaReport;