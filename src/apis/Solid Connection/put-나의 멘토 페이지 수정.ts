import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 나의 멘토 페이지 수정Request {
  // TODO: Define request type
}

const 나의 멘토 페이지 수정 = async (params: { data?: 나의 멘토 페이지 수정Request }): Promise<나의 멘토 페이지 수정Response> => {
  const res = await axiosInstance.put<나의 멘토 페이지 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use나의 멘토 페이지 수정 = () => {
  return useMutation<나의 멘토 페이지 수정Response, AxiosError, 나의 멘토 페이지 수정Request>({
    mutationFn: (data) => 나의 멘토 페이지 수정({ data }),
  });
};

export default use나의 멘토 페이지 수정;