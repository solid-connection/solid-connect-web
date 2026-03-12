import type { Metadata } from "next";

import ChatPageClient from "./_ui/ChatPageClient";

export const metadata: Metadata = {
  title: "멘토 채팅 목록 | Solid Connect",
  description: "멘토와의 채팅 목록을 확인하고 대화를 이어가세요.",
  keywords: ["멘토", "채팅", "대화", "멘토링", "소통"],
};

const ChatPage = () => {
  return (
    <div className="w-full px-5">
      <ChatPageClient />
    </div>
  );
};
export default ChatPage;
