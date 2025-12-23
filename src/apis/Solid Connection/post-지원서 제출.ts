import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 지원서 제출Request {
  // TODO: Define request type
}

const 지원서 제출 = async (params: { data?: 지원서 제출Request }): Promise<지원서 제출Response> => {
  const res = await axiosInstance.post<지원서 제출Response>(
    `{`, params?.data
  );
  return res.data;
};

const use지원서 제출 = () => {
  return useMutation<지원서 제출Response, AxiosError, 지원서 제출Request>({
    mutationFn: (data) => 지원서 제출({ data }),
  });
};

export default use지원서 제출;