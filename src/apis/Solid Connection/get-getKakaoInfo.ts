import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetKakaoInfoResponse {
  // TODO: Define response type
}

const getKakaoInfo = async (params: { params?: Record<string, any> }): Promise<GetKakaoInfoResponse> => {
  const res = await axiosInstance.get<GetKakaoInfoResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetKakaoInfo = (params?: Record<string, any>) => {
  return useQuery<GetKakaoInfoResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getKakaoInfo, params],
    queryFn: () => getKakaoInfo({ params }),
  });
};

export default useGetKakaoInfo;