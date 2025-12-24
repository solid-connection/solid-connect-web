import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  id: number;
  blockedId: number;
  nickname: string;
  createdAt: string;
}

export interface 차단한 유저 목록 조회Response {
  content: ContentItem[];
  nextPageNumber: number;
}

const 차단한 유저 목록 조회 = async (params: { params?: Record<string, any> }): Promise<차단한 유저 목록 조회Response> => {
  const res = await axiosInstance.get<차단한 유저 목록 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use차단한 유저 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<차단한 유저 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.차단한 유저 목록 조회, params],
    queryFn: () => 차단한 유저 목록 조회({ params }),
  });
};

export default use차단한 유저 목록 조회;