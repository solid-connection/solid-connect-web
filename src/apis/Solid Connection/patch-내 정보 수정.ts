import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 내 정보 수정Request {
  // TODO: Define request type
}

const 내 정보 수정 = async (params: { data?: 내 정보 수정Request }): Promise<내 정보 수정Response> => {
  const res = await axiosInstance.patch<내 정보 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use내 정보 수정 = () => {
  return useMutation<내 정보 수정Response, AxiosError, 내 정보 수정Request>({
    mutationFn: (data) => 내 정보 수정({ data }),
  });
};

export default use내 정보 수정;