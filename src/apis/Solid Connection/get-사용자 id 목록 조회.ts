import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface 사용자 id 목록 조회Response {
  // TODO: Define response type
}

const 사용자 id 목록 조회 = async (params: { params?: Record<string, any> }): Promise<사용자 id 목록 조회Response> => {
  const res = await axiosInstance.get<사용자 id 목록 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use사용자 id 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<사용자 id 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.사용자 id 목록 조회, params],
    queryFn: () => 사용자 id 목록 조회({ params }),
  });
};

export default use사용자 id 목록 조회;