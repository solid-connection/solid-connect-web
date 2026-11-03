import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { chatApi } from "./api";
import { useChatUserId } from "./auth";
import { chatKeys } from "./queryKeys";

/**
 * @description 채팅방 읽음 처리 훅
 */
const usePutChatRead = (contextUserId?: number) => {
  const queryClient = useQueryClient();
  const authenticatedUserId = useChatUserId();
  const userId = contextUserId ?? authenticatedUserId;

  return useMutation<void, AxiosError, number, { userId: number | null }>({
    mutationFn: (roomId) => chatApi.putReadChatRoom(roomId),
    onMutate: () => ({ userId }),
    onSuccess: (_data, _roomId, context) => {
      if (context?.userId) {
        return queryClient.invalidateQueries({ queryKey: chatKeys.rooms(context.userId) });
      }
    },
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default usePutChatRead;
