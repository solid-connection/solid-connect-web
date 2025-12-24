import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetBoardListResponse {
  0: string;
  1: string;
  2: string;
  3: string;
}

const getBoardList = async (params: { params?: Record<string, any> }): Promise<GetBoardListResponse> => {
  const res = await axiosInstance.get<GetBoardListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetBoardList = (params?: Record<string, any>) => {
  return useQuery<GetBoardListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getBoardList, params],
    queryFn: () => getBoardList({ params }),
  });
};

export default useGetBoardList;