import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 댓글 수정Request {
  // TODO: Define request type
}

const 댓글 수정 = async (params: { data?: 댓글 수정Request }): Promise<댓글 수정Response> => {
  const res = await axiosInstance.patch<댓글 수정Response>(
    `{`, params?.data
  );
  return res.data;
};

const use댓글 수정 = () => {
  return useMutation<댓글 수정Response, AxiosError, 댓글 수정Request>({
    mutationFn: (data) => 댓글 수정({ data }),
  });
};

export default use댓글 수정;