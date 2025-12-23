import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 채팅 내역 조회 = async (params: { params?: Record<string, any> }): Promise<채팅 내역 조회Response> => {
  const res = await axiosInstance.get<채팅 내역 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use채팅 내역 조회 = (params?: Record<string, any>) => {
  return useQuery<채팅 내역 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.채팅 내역 조회, params],
    queryFn: () => 채팅 내역 조회({ params }),
  });
};

export default use채팅 내역 조회;