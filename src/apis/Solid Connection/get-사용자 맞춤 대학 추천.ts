import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface 사용자 맞춤 대학 추천Response {
  // TODO: Define response type
}

const 사용자 맞춤 대학 추천 = async (params: { params?: Record<string, any> }): Promise<사용자 맞춤 대학 추천Response> => {
  const res = await axiosInstance.get<사용자 맞춤 대학 추천Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use사용자 맞춤 대학 추천 = (params?: Record<string, any>) => {
  return useQuery<사용자 맞춤 대학 추천Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.사용자 맞춤 대학 추천, params],
    queryFn: () => 사용자 맞춤 대학 추천({ params }),
  });
};

export default use사용자 맞춤 대학 추천;