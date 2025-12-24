import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 멘토링 수락거절Request {
  // TODO: Define request type
}

export interface 멘토링 수락거절Response {
  mentoringId: number;
}

const 멘토링 수락거절 = async (params: { data?: 멘토링 수락거절Request }): Promise<멘토링 수락거절Response> => {
  const res = await axiosInstance.patch<멘토링 수락거절Response>(
    `{`, params?.data
  );
  return res.data;
};

const use멘토링 수락거절 = () => {
  return useMutation<멘토링 수락거절Response, AxiosError, 멘토링 수락거절Request>({
    mutationFn: (data) => 멘토링 수락거절({ data }),
  });
};

export default use멘토링 수락거절;