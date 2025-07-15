import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import type { ChatMessage } from "@/types/mentor";

// 날짜 포맷팅 함수
const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
};

const ChatMessageBox = ({ message }: { message: ChatMessage }) => {
  const isMine = message.sender === "me";

  return isMine ? (
    <div className="flex justify-end">
      <div className="flex max-w-xs flex-row-reverse gap-2">
        <div className="flex flex-col items-end">
          <div className="flex items-end gap-1">
            <span className="text-xs text-k-500">{formatTime(message.time)}</span>
            <div className="rounded-b-xl rounded-tl-xl bg-primary px-3 py-2 text-white">
              <p className="whitespace-pre-line text-sm">{message.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-start">
      <div className="flex max-w-xs flex-row gap-2">
        <ProfileWithBadge width={32} height={32} />
        <div className="flex flex-col items-start">
          <span className="mb-1 text-xs font-medium text-k-900">{message.senderName}</span>
          <div className="flex items-end gap-1">
            <div className="rounded-b-xl rounded-tr-xl bg-k-100 px-3 py-2 text-k-900">
              <p className="whitespace-pre-line text-sm">{message.message}</p>
            </div>
            <span className="text-xs text-k-500">{formatTime(message.time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessageBox;
