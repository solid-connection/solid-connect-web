import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 위시 학교 추가Request {
  // TODO: Define request type
}

const 위시 학교 추가 = async (params: { data?: 위시 학교 추가Request }): Promise<위시 학교 추가Response> => {
  const res = await axiosInstance.post<위시 학교 추가Response>(
    `{`, params?.data
  );
  return res.data;
};

const use위시 학교 추가 = () => {
  return useMutation<위시 학교 추가Response, AxiosError, 위시 학교 추가Request>({
    mutationFn: (data) => 위시 학교 추가({ data }),
  });
};

export default use위시 학교 추가;