import ChatContent from "./_components/ChatContent";
import ChatNavBar from "./_components/ChatNavBar";

interface ChatDetailPageProps {
  params: { chatId: string };
}

const ChatDetailPage = ({ params }: ChatDetailPageProps) => {
  const { chatId } = params;
  return (
    <div className="flex flex-col">
      <ChatNavBar />
      <ChatContent />
    </div>
  );
};

export default ChatDetailPage;
