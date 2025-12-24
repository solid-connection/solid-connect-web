import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 학적 성적표 업로드Request {
  // TODO: Define request type
}

export interface 학적 성적표 업로드Response {
  fileUrl: string;
}

const 학적 성적표 업로드 = async (params: { data?: 학적 성적표 업로드Request }): Promise<학적 성적표 업로드Response> => {
  const res = await axiosInstance.post<학적 성적표 업로드Response>(
    `{`, params?.data
  );
  return res.data;
};

const use학적 성적표 업로드 = () => {
  return useMutation<학적 성적표 업로드Response, AxiosError, 학적 성적표 업로드Request>({
    mutationFn: (data) => 학적 성적표 업로드({ data }),
  });
};

export default use학적 성적표 업로드;