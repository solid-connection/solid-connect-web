import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetUnconfirmedMentoringCountResponse {
  uncheckedCount: number;
}

const getUnconfirmedMentoringCount = async (params: { params?: Record<string, any> }): Promise<GetUnconfirmedMentoringCountResponse> => {
  const res = await axiosInstance.get<GetUnconfirmedMentoringCountResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetUnconfirmedMentoringCount = (params?: Record<string, any>) => {
  return useQuery<GetUnconfirmedMentoringCountResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getUnconfirmedMentoringCount, params],
    queryFn: () => getUnconfirmedMentoringCount({ params }),
  });
};

export default useGetUnconfirmedMentoringCount;