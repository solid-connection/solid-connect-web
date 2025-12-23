import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 매칭된 멘토 목록 = async (params: { params?: Record<string, any> }): Promise<매칭된 멘토 목록Response> => {
  const res = await axiosInstance.get<매칭된 멘토 목록Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use매칭된 멘토 목록 = (params?: Record<string, any>) => {
  return useQuery<매칭된 멘토 목록Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.매칭된 멘토 목록, params],
    queryFn: () => 매칭된 멘토 목록({ params }),
  });
};

export default use매칭된 멘토 목록;