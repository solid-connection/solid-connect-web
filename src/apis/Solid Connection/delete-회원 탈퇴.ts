import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 회원 탈퇴Request {
  // TODO: Define request type
}

const 회원 탈퇴 = async (): Promise<회원 탈퇴Response> => {
  const res = await axiosInstance.delete<회원 탈퇴Response>(
    `{`
  );
  return res.data;
};

const use회원 탈퇴 = () => {
  return useMutation<회원 탈퇴Response, AxiosError, 회원 탈퇴Request>({
    mutationFn: (data) => 회원 탈퇴({ data }),
  });
};

export default use회원 탈퇴;