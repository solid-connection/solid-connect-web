import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 소식지 수정Request {
  // TODO: Define request type
}

const 소식지 수정 = async (params: { data?: 소식지 수정Request }): Promise<소식지 수정Response> => {
  const res = await axiosInstance.put<소식지 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use소식지 수정 = () => {
  return useMutation<소식지 수정Response, AxiosError, 소식지 수정Request>({
    mutationFn: (data) => 소식지 수정({ data }),
  });
};

export default use소식지 수정;