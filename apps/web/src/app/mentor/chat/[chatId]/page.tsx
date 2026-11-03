import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ChatContent from "./_ui/ChatContent";

export const metadata: Metadata = {
  title: "멘토와 채팅 | 솔리드커넥션",
  description: "멘토와 실시간으로 대화하며 궁금한 점을 해결해보세요.",
  robots: NO_INDEX_ROBOTS,
};

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const { chatId: chatIdParam } = await params;
  const chatId = Number(chatIdParam);

  if (!/^\d+$/.test(chatIdParam) || !Number.isSafeInteger(chatId) || chatId <= 0) notFound();
  return (
    <div className="flex w-full flex-col">
      <ChatContent key={chatId} chatId={chatId} />
    </div>
  );
};

export default ChatDetailPage;
