import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 비밀번호 변경Request {
  // TODO: Define request type
}

const 비밀번호 변경 = async (params: { data?: 비밀번호 변경Request }): Promise<비밀번호 변경Response> => {
  const res = await axiosInstance.patch<비밀번호 변경Response>(
    `{`, params?.data
  );
  return res.data;
};

const use비밀번호 변경 = () => {
  return useMutation<비밀번호 변경Response, AxiosError, 비밀번호 변경Request>({
    mutationFn: (data) => 비밀번호 변경({ data }),
  });
};

export default use비밀번호 변경;