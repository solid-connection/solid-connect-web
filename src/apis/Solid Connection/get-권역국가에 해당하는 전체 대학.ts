import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const 권역국가에 해당하는 전체 대학 = async (params: { params?: Record<string, any> }): Promise<권역국가에 해당하는 전체 대학Response> => {
  const res = await axiosInstance.get<권역국가에 해당하는 전체 대학Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use권역국가에 해당하는 전체 대학 = (params?: Record<string, any>) => {
  return useQuery<권역국가에 해당하는 전체 대학Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.권역국가에 해당하는 전체 대학, params],
    queryFn: () => 권역국가에 해당하는 전체 대학({ params }),
  });
};

export default use권역국가에 해당하는 전체 대학;