import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 학점 조회 = async (params: { params?: Record<string, any> }): Promise<학점 조회Response> => {
  const res = await axiosInstance.get<학점 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use학점 조회 = (params?: Record<string, any>) => {
  return useQuery<학점 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.학점 조회, params],
    queryFn: () => 학점 조회({ params }),
  });
};

export default use학점 조회;