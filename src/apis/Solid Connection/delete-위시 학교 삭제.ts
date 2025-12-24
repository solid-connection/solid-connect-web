import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 위시 학교 삭제Request {
  // TODO: Define request type
}

const 위시 학교 삭제 = async (): Promise<위시 학교 삭제Response> => {
  const res = await axiosInstance.delete<위시 학교 삭제Response>(
    `{`
  );
  return res.data;
};

const use위시 학교 삭제 = () => {
  return useMutation<위시 학교 삭제Response, AxiosError, 위시 학교 삭제Request>({
    mutationFn: (data) => 위시 학교 삭제({ data }),
  });
};

export default use위시 학교 삭제;