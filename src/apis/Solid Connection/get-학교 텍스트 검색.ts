import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 학교 텍스트 검색 = async (params: { params?: Record<string, any> }): Promise<학교 텍스트 검색Response> => {
  const res = await axiosInstance.get<학교 텍스트 검색Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use학교 텍스트 검색 = (params?: Record<string, any>) => {
  return useQuery<학교 텍스트 검색Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.학교 텍스트 검색, params],
    queryFn: () => 학교 텍스트 검색({ params }),
  });
};

export default use학교 텍스트 검색;