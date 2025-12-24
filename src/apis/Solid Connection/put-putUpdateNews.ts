import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PutUpdateNewsRequest {
  // TODO: Define request type
}

export interface PutUpdateNewsResponse {
  id: number;
}

const putUpdateNews = async (params: { data?: PutUpdateNewsRequest }): Promise<PutUpdateNewsResponse> => {
  const res = await axiosInstance.put<PutUpdateNewsResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePutUpdateNews = () => {
  return useMutation<PutUpdateNewsResponse, AxiosError, PutUpdateNewsRequest>({
    mutationFn: (data) => putUpdateNews({ data }),
  });
};

export default usePutUpdateNews;