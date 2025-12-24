import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 어학 검증 및 수정Request {
  // TODO: Define request type
}

const 어학 검증 및 수정 = async (params: { data?: 어학 검증 및 수정Request }): Promise<어학 검증 및 수정Response> => {
  const res = await axiosInstance.put<어학 검증 및 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use어학 검증 및 수정 = () => {
  return useMutation<어학 검증 및 수정Response, AxiosError, 어학 검증 및 수정Request>({
    mutationFn: (data) => 어학 검증 및 수정({ data }),
  });
};

export default use어학 검증 및 수정;