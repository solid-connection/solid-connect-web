import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 로그아웃Request {
  // TODO: Define request type
}

const 로그아웃 = async (params: { data?: 로그아웃Request }): Promise<로그아웃Response> => {
  const res = await axiosInstance.post<로그아웃Response>(
    `{`, params?.data
  );
  return res.data;
};

const use로그아웃 = () => {
  return useMutation<로그아웃Response, AxiosError, 로그아웃Request>({
    mutationFn: (data) => 로그아웃({ data }),
  });
};

export default use로그아웃;