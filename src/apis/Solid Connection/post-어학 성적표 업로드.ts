import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 어학 성적표 업로드Request {
  // TODO: Define request type
}

export interface 어학 성적표 업로드Response {
  fileUrl: string;
}

const 어학 성적표 업로드 = async (params: { data?: 어학 성적표 업로드Request }): Promise<어학 성적표 업로드Response> => {
  const res = await axiosInstance.post<어학 성적표 업로드Response>(
    `{`, params?.data
  );
  return res.data;
};

const use어학 성적표 업로드 = () => {
  return useMutation<어학 성적표 업로드Response, AxiosError, 어학 성적표 업로드Request>({
    mutationFn: (data) => 어학 성적표 업로드({ data }),
  });
};

export default use어학 성적표 업로드;