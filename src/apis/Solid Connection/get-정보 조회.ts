import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface 정보 조회Response {
  // TODO: Define response type
}

const 정보 조회 = async (params: { params?: Record<string, any> }): Promise<정보 조회Response> => {
  const res = await axiosInstance.get<정보 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use정보 조회 = (params?: Record<string, any>) => {
  return useQuery<정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.정보 조회, params],
    queryFn: () => 정보 조회({ params }),
  });
};

export default use정보 조회;