import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 어학 성적 등록Request {
  // TODO: Define request type
}

const 어학 성적 등록 = async (params: { data?: 어학 성적 등록Request }): Promise<어학 성적 등록Response> => {
  const res = await axiosInstance.post<어학 성적 등록Response>(
    `{`, params?.data
  );
  return res.data;
};

const use어학 성적 등록 = () => {
  return useMutation<어학 성적 등록Response, AxiosError, 어학 성적 등록Request>({
    mutationFn: (data) => 어학 성적 등록({ data }),
  });
};

export default use어학 성적 등록;