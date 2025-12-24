import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetNicknameExistsResponse {
  exists: boolean;
}

const getNicknameExists = async (params: { params?: Record<string, any> }): Promise<GetNicknameExistsResponse> => {
  const res = await axiosInstance.get<GetNicknameExistsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetNicknameExists = (params?: Record<string, any>) => {
  return useQuery<GetNicknameExistsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getNicknameExists, params],
    queryFn: () => getNicknameExists({ params }),
  });
};

export default useGetNicknameExists;