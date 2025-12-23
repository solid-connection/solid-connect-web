import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 어학 성적 조회 = async (params: { params?: Record<string, any> }): Promise<어학 성적 조회Response> => {
  const res = await axiosInstance.get<어학 성적 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use어학 성적 조회 = (params?: Record<string, any>) => {
  return useQuery<어학 성적 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.어학 성적 조회, params],
    queryFn: () => 어학 성적 조회({ params }),
  });
};

export default use어학 성적 조회;