import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 닉네임 중복 검증 = async (params: { params?: Record<string, any> }): Promise<닉네임 중복 검증Response> => {
  const res = await axiosInstance.get<닉네임 중복 검증Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use닉네임 중복 검증 = (params?: Record<string, any>) => {
  return useQuery<닉네임 중복 검증Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.닉네임 중복 검증, params],
    queryFn: () => 닉네임 중복 검증({ params }),
  });
};

export default use닉네임 중복 검증;