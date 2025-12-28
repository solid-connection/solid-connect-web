import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi, CommunityQueryKeys, PostIdResponse, PostUpdateRequest } from "./api";
import { toast } from "@/lib/zustand/useToastStore";

interface UpdatePostVariables {
  postId: number;
  data: PostUpdateRequest;
}

/**
 * @description 게시글 수정을 위한 useMutation 커스텀 훅
 */
const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<PostIdResponse, AxiosError, UpdatePostVariables>({
    mutationFn: ({ postId, data }) => communityApi.updatePost(postId, data),
    onSuccess: (result, variables) => {
      // 해당 게시글 상세 쿼리와 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });
      toast.success("게시글이 수정되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      toast.error("게시글 수정에 실패했습니다.");
    },
  });
};

export default useUpdatePost;