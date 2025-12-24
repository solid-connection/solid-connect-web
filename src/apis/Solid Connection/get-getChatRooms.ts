import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const getChatRooms = async (params: { params?: Record<string, any> }): Promise<GetChatRoomsResponse> => {
  const res = await axiosInstance.get<GetChatRoomsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetChatRooms = (params?: Record<string, any>) => {
  return useQuery<GetChatRoomsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getChatRooms, params],
    queryFn: () => getChatRooms({ params }),
  });
};

export default useGetChatRooms;