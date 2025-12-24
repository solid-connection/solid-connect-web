import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 관심 권역국가 변경Request {
  // TODO: Define request type
}

const 관심 권역국가 변경 = async (params: { data?: 관심 권역국가 변경Request }): Promise<관심 권역국가 변경Response> => {
  const res = await axiosInstance.patch<관심 권역국가 변경Response>(
    `{`, params?.data
  );
  return res.data;
};

const use관심 권역국가 변경 = () => {
  return useMutation<관심 권역국가 변경Response, AxiosError, 관심 권역국가 변경Request>({
    mutationFn: (data) => 관심 권역국가 변경({ data }),
  });
};

export default use관심 권역국가 변경;