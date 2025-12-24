import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostReportRequest {
  // TODO: Define request type
}

export interface PostReportResponse {

}

const postReport = async (params: { data?: PostReportRequest }): Promise<PostReportResponse> => {
  const res = await axiosInstance.post<PostReportResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostReport = () => {
  return useMutation<PostReportResponse, AxiosError, PostReportRequest>({
    mutationFn: (data) => postReport({ data }),
  });
};

export default usePostReport;