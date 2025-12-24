import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 게시글 수정Request {
  // TODO: Define request type
}

const 게시글 수정 = async (params: { data?: 게시글 수정Request }): Promise<게시글 수정Response> => {
  const res = await axiosInstance.patch<게시글 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use게시글 수정 = () => {
  return useMutation<게시글 수정Response, AxiosError, 게시글 수정Request>({
    mutationFn: (data) => 게시글 수정({ data }),
  });
};

export default use게시글 수정;