import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 게시판 조회 = async (params: { params?: Record<string, any> }): Promise<게시판 조회Response> => {
  const res = await axiosInstance.get<게시판 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use게시판 조회 = (params?: Record<string, any>) => {
  return useQuery<게시판 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.게시판 조회, params],
    queryFn: () => 게시판 조회({ params }),
  });
};

export default use게시판 조회;