import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetChatPartnerResponse {
  partnerId: number;
  nickname: string;
  profileUrl: string;
}

const getChatPartner = async (params: { params?: Record<string, any> }): Promise<GetChatPartnerResponse> => {
  const res = await axiosInstance.get<GetChatPartnerResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetChatPartner = (params?: Record<string, any>) => {
  return useQuery<GetChatPartnerResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getChatPartner, params],
    queryFn: () => getChatPartner({ params }),
  });
};

export default useGetChatPartner;