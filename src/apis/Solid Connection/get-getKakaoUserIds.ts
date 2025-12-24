import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetKakaoUserIdsResponse {
  // TODO: Define response type
}

const getKakaoUserIds = async (params: { params?: Record<string, any> }): Promise<GetKakaoUserIdsResponse> => {
  const res = await axiosInstance.get<GetKakaoUserIdsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetKakaoUserIds = (params?: Record<string, any>) => {
  return useQuery<GetKakaoUserIdsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getKakaoUserIds, params],
    queryFn: () => getKakaoUserIds({ params }),
  });
};

export default useGetKakaoUserIds;