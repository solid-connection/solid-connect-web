import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 학점조회 = async (params: { params?: Record<string, any> }): Promise<학점조회Response> => {
  const res = await axiosInstance.get<학점조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use학점조회 = (params?: Record<string, any>) => {
  return useQuery<학점조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.학점조회, params],
    queryFn: () => 학점조회({ params }),
  });
};

export default use학점조회;