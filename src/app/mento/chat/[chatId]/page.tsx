import ChatNavBar from "./_components/ChatNavBar";

interface ChatDetailPageProps {
  params: { chatId: string };
}

const ChatDetailPage = ({ params }: ChatDetailPageProps) => {
  return (
    <>
      <ChatNavBar />
      Chat ID: {params.chatId}
    </>
  );
};

export default ChatDetailPage;
