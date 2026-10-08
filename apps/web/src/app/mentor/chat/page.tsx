import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ChatPageClient from "./_ui/ChatPageClient";

export const metadata: Metadata = {
  title: "멘토 채팅 목록 | 솔리드커넥션",
  description: "멘토와의 채팅 목록을 확인하고 대화를 이어가세요.",
  robots: NO_INDEX_ROBOTS,
};

const ChatPage = () => {
  return (
    <div className="w-full px-5 md:px-0">
      <ChatPageClient />
    </div>
  );
};
export default ChatPage;
