import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 멘토링 확인Request {
  // TODO: Define request type
}

export interface 멘토링 확인Response {
  checkedMentoringIds: number[];
}

const 멘토링 확인 = async (params: { data?: 멘토링 확인Request }): Promise<멘토링 확인Response> => {
  const res = await axiosInstance.patch<멘토링 확인Response>(
    `{`, params?.data
  );
  return res.data;
};

const use멘토링 확인 = () => {
  return useMutation<멘토링 확인Response, AxiosError, 멘토링 확인Request>({
    mutationFn: (data) => 멘토링 확인({ data }),
  });
};

export default use멘토링 확인;