import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 댓글 작성Request {
  // TODO: Define request type
}

const 댓글 작성 = async (params: { data?: 댓글 작성Request }): Promise<댓글 작성Response> => {
  const res = await axiosInstance.post<댓글 작성Response>(
    `{`, params?.data
  );
  return res.data;
};

const use댓글 작성 = () => {
  return useMutation<댓글 작성Response, AxiosError, 댓글 작성Request>({
    mutationFn: (data) => 댓글 작성({ data }),
  });
};

export default use댓글 작성;