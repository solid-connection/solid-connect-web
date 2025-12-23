import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 위시 학교 목록 조회 = async (params: { params?: Record<string, any> }): Promise<위시 학교 목록 조회Response> => {
  const res = await axiosInstance.get<위시 학교 목록 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use위시 학교 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<위시 학교 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.위시 학교 목록 조회, params],
    queryFn: () => 위시 학교 목록 조회({ params }),
  });
};

export default use위시 학교 목록 조회;