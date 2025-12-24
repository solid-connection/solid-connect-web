import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  attachments: AttachmentsItem[];
}

export interface AttachmentsItem {
  id: number;
  isImage: boolean;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface GetChatMessagesResponse {
  nextPageNumber: number;
  content: ContentItem[];
}

const getChatMessages = async (params: { params?: Record<string, any> }): Promise<GetChatMessagesResponse> => {
  const res = await axiosInstance.get<GetChatMessagesResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetChatMessages = (params?: Record<string, any>) => {
  return useQuery<GetChatMessagesResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getChatMessages, params],
    queryFn: () => getChatMessages({ params }),
  });
};

export default useGetChatMessages;