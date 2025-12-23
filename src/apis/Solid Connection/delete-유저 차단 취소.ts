import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 유저 차단 취소Request {
  // TODO: Define request type
}

const 유저 차단 취소 = async (): Promise<유저 차단 취소Response> => {
  const res = await axiosInstance.delete<유저 차단 취소Response>(
    `{`
  );
  return res.data;
};

const use유저 차단 취소 = () => {
  return useMutation<유저 차단 취소Response, AxiosError, 유저 차단 취소Request>({
    mutationFn: (data) => 유저 차단 취소({ data }),
  });
};

export default use유저 차단 취소;