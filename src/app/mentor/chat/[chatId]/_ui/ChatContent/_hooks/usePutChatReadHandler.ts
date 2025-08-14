import { useEffect } from "react";

import usePutChatRead from "@/api/chat/clients/usePutChatRead";

const usePutChatReadHandler = (chatId: number) => {
  const { mutate: putChatRead } = usePutChatRead();

  useEffect(() => {
    if (chatId) {
      putChatRead(chatId);
    }
  }, [chatId, putChatRead]);
};
export default usePutChatReadHandler;
