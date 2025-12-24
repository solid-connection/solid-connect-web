import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface 확인하지 않은 멘토링 수Response {
  uncheckedCount: number;
}

const 확인하지 않은 멘토링 수 = async (params: { params?: Record<string, any> }): Promise<확인하지 않은 멘토링 수Response> => {
  const res = await axiosInstance.get<확인하지 않은 멘토링 수Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use확인하지 않은 멘토링 수 = (params?: Record<string, any>) => {
  return useQuery<확인하지 않은 멘토링 수Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.확인하지 않은 멘토링 수, params],
    queryFn: () => 확인하지 않은 멘토링 수({ params }),
  });
};

export default use확인하지 않은 멘토링 수;