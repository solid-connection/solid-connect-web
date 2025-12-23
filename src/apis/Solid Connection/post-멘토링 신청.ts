import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 멘토링 신청Request {
  // TODO: Define request type
}

const 멘토링 신청 = async (params: { data?: 멘토링 신청Request }): Promise<멘토링 신청Response> => {
  const res = await axiosInstance.post<멘토링 신청Response>(
    `{`, params?.data
  );
  return res.data;
};

const use멘토링 신청 = () => {
  return useMutation<멘토링 신청Response, AxiosError, 멘토링 신청Request>({
    mutationFn: (data) => 멘토링 신청({ data }),
  });
};

export default use멘토링 신청;