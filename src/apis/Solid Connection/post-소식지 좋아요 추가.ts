import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 소식지 좋아요 추가Request {
  // TODO: Define request type
}

const 소식지 좋아요 추가 = async (params: { data?: 소식지 좋아요 추가Request }): Promise<소식지 좋아요 추가Response> => {
  const res = await axiosInstance.post<소식지 좋아요 추가Response>(
    `{`, params?.data
  );
  return res.data;
};

const use소식지 좋아요 추가 = () => {
  return useMutation<소식지 좋아요 추가Response, AxiosError, 소식지 좋아요 추가Request>({
    mutationFn: (data) => 소식지 좋아요 추가({ data }),
  });
};

export default use소식지 좋아요 추가;