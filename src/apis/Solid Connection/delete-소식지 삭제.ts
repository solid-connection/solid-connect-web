import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 소식지 삭제Request {
  // TODO: Define request type
}

const 소식지 삭제 = async (): Promise<소식지 삭제Response> => {
  const res = await axiosInstance.delete<소식지 삭제Response>(
    `{`
  );
  return res.data;
};

const use소식지 삭제 = () => {
  return useMutation<소식지 삭제Response, AxiosError, 소식지 삭제Request>({
    mutationFn: (data) => 소식지 삭제({ data }),
  });
};

export default use소식지 삭제;