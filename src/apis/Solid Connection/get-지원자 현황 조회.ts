import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 지원자 현황 조회 = async (params: { params?: Record<string, any> }): Promise<지원자 현황 조회Response> => {
  const res = await axiosInstance.get<지원자 현황 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use지원자 현황 조회 = (params?: Record<string, any>) => {
  return useQuery<지원자 현황 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.지원자 현황 조회, params],
    queryFn: () => 지원자 현황 조회({ params }),
  });
};

export default use지원자 현황 조회;