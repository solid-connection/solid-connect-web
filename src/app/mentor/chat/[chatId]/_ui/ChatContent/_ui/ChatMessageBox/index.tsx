import Image from "next/image";

import { formatTime } from "@/utils/datetimeUtils";
import { downloadFile, getFileExtension, getFileNamePrefix } from "@/utils/fileUtils";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { getMessageType, shouldShowContent } from "./_utils/messageUtils";

import type { ChatMessage } from "@/types/chat";

interface ChatMessageBoxProps {
  message: ChatMessage;
  currentUserId?: number; // 현재 사용자 ID
  partnerNickname?: string; // 상대방 닉네임
}

const ChatMessageBox = ({ message, currentUserId = 1, partnerNickname = "상대방" }: ChatMessageBoxProps) => {
  const isMine = message.senderId === Number(currentUserId);

  const messageType = getMessageType(message);

  // 첨부파일 렌더링 함수
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment) => (
          <div key={attachment.id}>
            {attachment.isImage ? (
              // 이미지 렌더링
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={attachment.url}
                  alt="첨부 이미지"
                  width={200}
                  height={150}
                  className="max-w-[200px] rounded-lg object-cover"
                  unoptimized
                />
              </div>
            ) : (
              // 파일 렌더링
              <div
                className="flex max-w-[250px] cursor-pointer items-center space-x-3 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
                role="button"
                tabIndex={0}
                onClick={() => downloadFile(attachment.url, getFileNamePrefix(attachment.url))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    downloadFile(attachment.url, getFileNamePrefix(attachment.url));
                  }
                }}
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="typo-medium-2 text-k-900">첨부파일</div>
                  <div className="typo-regular-4 text-k-400">클릭시 다운로드 됩니다</div>
                  <div className="typo-regular-4 text-secondary">{getFileExtension(attachment.url)} 파일</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return isMine ? (
    <div className="flex justify-end">
      <div className="flex max-w-xs flex-row-reverse gap-2">
        <div className="flex flex-col items-end">
          <div className="flex items-end gap-1">
            <span className="typo-regular-4 text-k-500">{formatTime(message.createdAt)}</span>
            <div className="rounded-b-xl rounded-tl-xl bg-primary px-3 py-2 text-white">
              {shouldShowContent(messageType) && <p className="whitespace-pre-line typo-regular-2">{message.content}</p>}
              {renderAttachments()}
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
          <span className="mb-1 typo-medium-5 text-k-900">{partnerNickname}</span>
          <div className="flex items-end gap-1">
            <div className="rounded-b-xl rounded-tr-xl bg-k-100 px-3 py-2 text-k-900">
              {shouldShowContent(messageType) && <p className="whitespace-pre-line typo-regular-2">{message.content}</p>}
              {renderAttachments()}
            </div>
            <span className="typo-regular-4 text-k-500">{formatTime(message.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessageBox;
