import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 게시글 postsApi, 게시글 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet게시글 조회 = (postId: string | number, params?: Record<string, any>) => {
  return useQuery<게시글 조회Response, AxiosError>({
    queryKey: [QueryKeys['게시글- posts'].게시글 조회, postId, params],
    queryFn: () => 게시글 postsApi.get게시글 조회({ postId, params }),
    enabled: !!postId,
  });
};

export default useGet게시글 조회;