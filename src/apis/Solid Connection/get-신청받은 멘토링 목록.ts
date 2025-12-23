import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 신청받은 멘토링 목록 = async (params: { params?: Record<string, any> }): Promise<신청받은 멘토링 목록Response> => {
  const res = await axiosInstance.get<신청받은 멘토링 목록Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use신청받은 멘토링 목록 = (params?: Record<string, any>) => {
  return useQuery<신청받은 멘토링 목록Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.신청받은 멘토링 목록, params],
    queryFn: () => 신청받은 멘토링 목록({ params }),
  });
};

export default use신청받은 멘토링 목록;