import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 학점 등록Request {
  // TODO: Define request type
}

const 학점 등록 = async (params: { data?: 학점 등록Request }): Promise<학점 등록Response> => {
  const res = await axiosInstance.post<학점 등록Response>(
    `{`, params?.data
  );
  return res.data;
};

const use학점 등록 = () => {
  return useMutation<학점 등록Response, AxiosError, 학점 등록Request>({
    mutationFn: (data) => 학점 등록({ data }),
  });
};

export default use학점 등록;