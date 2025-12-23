import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 학교 상세 정보 조회 = async (params: { params?: Record<string, any> }): Promise<학교 상세 정보 조회Response> => {
  const res = await axiosInstance.get<학교 상세 정보 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use학교 상세 정보 조회 = (params?: Record<string, any>) => {
  return useQuery<학교 상세 정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.학교 상세 정보 조회, params],
    queryFn: () => 학교 상세 정보 조회({ params }),
  });
};

export default use학교 상세 정보 조회;