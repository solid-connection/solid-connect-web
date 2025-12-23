import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 나의 멘토 페이지 조회 = async (params: { params?: Record<string, any> }): Promise<나의 멘토 페이지 조회Response> => {
  const res = await axiosInstance.get<나의 멘토 페이지 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use나의 멘토 페이지 조회 = (params?: Record<string, any>) => {
  return useQuery<나의 멘토 페이지 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.나의 멘토 페이지 조회, params],
    queryFn: () => 나의 멘토 페이지 조회({ params }),
  });
};

export default use나의 멘토 페이지 조회;