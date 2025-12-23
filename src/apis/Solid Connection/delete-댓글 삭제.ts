import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 댓글 삭제Request {
  // TODO: Define request type
}

const 댓글 삭제 = async (): Promise<댓글 삭제Response> => {
  const res = await axiosInstance.delete<댓글 삭제Response>(
    `{`
  );
  return res.data;
};

const use댓글 삭제 = () => {
  return useMutation<댓글 삭제Response, AxiosError, 댓글 삭제Request>({
    mutationFn: (data) => 댓글 삭제({ data }),
  });
};

export default use댓글 삭제;