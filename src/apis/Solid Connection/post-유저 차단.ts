import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 유저 차단Request {
  // TODO: Define request type
}

const 유저 차단 = async (params: { data?: 유저 차단Request }): Promise<유저 차단Response> => {
  const res = await axiosInstance.post<유저 차단Response>(
    `{`, params?.data
  );
  return res.data;
};

const use유저 차단 = () => {
  return useMutation<유저 차단Response, AxiosError, 유저 차단Request>({
    mutationFn: (data) => 유저 차단({ data }),
  });
};

export default use유저 차단;