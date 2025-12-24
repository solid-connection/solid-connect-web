import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 멘토 목록 조회 = async (params: { params?: Record<string, any> }): Promise<멘토 목록 조회Response> => {
  const res = await axiosInstance.get<멘토 목록 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use멘토 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<멘토 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.멘토 목록 조회, params],
    queryFn: () => 멘토 목록 조회({ params }),
  });
};

export default use멘토 목록 조회;