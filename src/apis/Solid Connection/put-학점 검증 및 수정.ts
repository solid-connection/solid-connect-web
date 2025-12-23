import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 학점 검증 및 수정Request {
  // TODO: Define request type
}

const 학점 검증 및 수정 = async (params: { data?: 학점 검증 및 수정Request }): Promise<학점 검증 및 수정Response> => {
  const res = await axiosInstance.put<학점 검증 및 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use학점 검증 및 수정 = () => {
  return useMutation<학점 검증 및 수정Response, AxiosError, 학점 검증 및 수정Request>({
    mutationFn: (data) => 학점 검증 및 수정({ data }),
  });
};

export default use학점 검증 및 수정;