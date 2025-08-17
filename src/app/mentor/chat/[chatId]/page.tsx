import { Metadata } from "next";
import { redirect } from "next/navigation";

import ChatContent from "./_ui/ChatContent";
import ChatNavBar from "./_ui/ChatNavBar";

export const metadata: Metadata = {
  title: "멘토와 채팅 | Solid Connect",
  description: "멘토와 실시간으로 대화하며 궁금한 점을 해결해보세요.",
  keywords: ["멘토", "채팅", "실시간", "대화", "멘토링", "질문"],
};

interface ChatDetailPageProps {
  params: { chatId: string };
}

const ChatDetailPage = ({ params }: ChatDetailPageProps) => {
  const chatId = Number(params.chatId);

  if (isNaN(chatId)) {
    redirect("/login"); // 로그인 페이지로 이동
  }
  return (
    <div className="flex flex-col">
      <ChatNavBar chatId={chatId} />
      <ChatContent chatId={chatId} />
    </div>
  );
};

export default ChatDetailPage;
