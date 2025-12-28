import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { communityApi, PostDetailResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetPostDetail = (postId: string | number, params?: Record<string, any>) => {
  return useQuery<PostDetailResponse, AxiosError>({
    queryKey: [QueryKeys.community.postDetail, postId, params],
    queryFn: () => communityApi.getPostDetail({ postId, params }),
    enabled: !!postId,
  });
};

export default useGetPostDetail;