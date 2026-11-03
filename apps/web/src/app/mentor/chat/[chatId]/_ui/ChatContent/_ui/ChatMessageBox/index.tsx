"use client";

import { useEffect, useState } from "react";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import type { ChatAttachment, ChatMessage } from "@/types/chat";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { formatTime } from "@/utils/datetimeUtils";
import { downloadFile, getFileExtension, getFileNamePrefix } from "@/utils/fileUtils";
import { getMessageType, shouldShowContent } from "./_utils/messageUtils";

const IMAGE_MAX_ATTEMPTS = 3;
const IMAGE_RETRY_DELAY_MS = 1000;

type ImageStatus = "loading" | "loaded" | "waiting" | "failed";

interface ChatMessageBoxProps {
  message: ChatMessage;
  currentUserId?: number;
  partnerNickname?: string;
  partnerProfileUrl?: string | null;
  isPartnerMentor?: boolean;
}

const getImageRetryUrl = (src: string, attempt: number, retryRound: number) => {
  if (src.startsWith("blob:") || src.startsWith("data:") || (attempt === 0 && retryRound === 0)) return src;

  try {
    const url = new URL(src);
    url.searchParams.set("__chat_image_retry", `${retryRound}-${attempt}`);
    return url.toString();
  } catch {
    return src;
  }
};

const RetryableImage = ({ src }: { src: string }) => {
  const [attempt, setAttempt] = useState(0);
  const [retryRound, setRetryRound] = useState(0);
  const [status, setStatus] = useState<ImageStatus>("loading");

  useEffect(
    function retryFailedImage() {
      if (status !== "waiting") return;

      const timeoutId = setTimeout(() => {
        setAttempt((previous) => previous + 1);
        setStatus("loading");
      }, IMAGE_RETRY_DELAY_MS);

      return function cancelImageRetry() {
        clearTimeout(timeoutId);
      };
    },
    [status],
  );

  return (
    <div className="relative h-[150px] w-[200px] max-w-full overflow-hidden rounded-lg bg-k-50">
      {status === "failed" ? (
        <div
          role="status"
          className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-k-700"
        >
          <p className="typo-regular-4">이미지를 불러오지 못했어요.</p>
          <button
            type="button"
            onClick={() => {
              setAttempt(0);
              setRetryRound((previous) => previous + 1);
              setStatus("loading");
            }}
            className="rounded border border-k-200 px-3 py-1 typo-regular-4"
          >
            다시 불러오기
          </button>
        </div>
      ) : (
        <>
          {status !== "loaded" && (
            <div
              role="status"
              aria-label="이미지 불러오는 중"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          <img
            key={`${retryRound}-${attempt}`}
            src={getImageRetryUrl(src, attempt, retryRound)}
            alt="첨부 이미지"
            width={200}
            height={150}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus(attempt + 1 < IMAGE_MAX_ATTEMPTS ? "waiting" : "failed")}
            className={`h-full w-full rounded-lg object-cover ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          />
        </>
      )}
    </div>
  );
};

const ChatImage = ({ attachment }: { attachment: ChatAttachment }) => {
  const src = normalizeImageUrlToUploadCdn(attachment.previewUrl ?? attachment.thumbnailUrl ?? attachment.url);
  return <RetryableImage key={src} src={src} />;
};

const ChatMessageBox = ({
  message,
  currentUserId = 0,
  partnerNickname = "상대방",
  partnerProfileUrl = null,
  isPartnerMentor = false,
}: ChatMessageBoxProps) => {
  const isMine = message.senderId === Number(currentUserId);

  const messageType = getMessageType(message);

  // 첨부파일 렌더링 함수
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment, index) => (
          <div key={`${attachment.id > 0 ? attachment.id : attachment.url}-${index}`}>
            {attachment.isImage ? (
              // 이미지 렌더링
              <ChatImage attachment={attachment} />
            ) : (
              // 파일 렌더링
              <button
                type="button"
                className="flex max-w-[250px] cursor-pointer items-center space-x-3 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
                onClick={() => downloadFile(attachment.url, getFileNamePrefix(attachment.url))}
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="text-k-900 typo-medium-2">첨부파일</div>
                  <div className="text-k-400 typo-regular-4">클릭시 다운로드 됩니다</div>
                  <div className="text-secondary typo-regular-4">{getFileExtension(attachment.url)} 파일</div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return isMine ? (
    <div className="flex min-w-0 justify-end">
      <div className="flex max-w-[min(80%,24rem)] min-w-0 flex-row-reverse gap-2">
        <div className="flex min-w-0 flex-col items-end">
          <div className="flex min-w-0 items-end gap-1">
            <span className="shrink-0 text-k-500 typo-regular-4">{formatTime(message.createdAt)}</span>
            <div className="min-w-0 rounded-b-xl rounded-tl-xl bg-primary px-3 py-2 text-white">
              {shouldShowContent(messageType) && (
                <p className="whitespace-pre-line break-words typo-regular-2">{message.content}</p>
              )}
              {renderAttachments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-w-0 justify-start">
      <div className="flex max-w-[min(100%,28rem)] min-w-0 flex-row gap-2">
        <ProfileWithBadge profileImageUrl={partnerProfileUrl} isMentor={isPartnerMentor} width={32} height={32} />
        <div className="flex min-w-0 flex-col items-start">
          <span className="mb-1 text-k-900 typo-medium-5">{partnerNickname}</span>
          <div className="flex min-w-0 items-end gap-1">
            <div className="min-w-0 rounded-b-xl rounded-tr-xl bg-k-100 px-3 py-2 text-k-900">
              {shouldShowContent(messageType) && (
                <p className="whitespace-pre-line break-words typo-regular-2">{message.content}</p>
              )}
              {renderAttachments()}
            </div>
            <span className="shrink-0 text-k-500 typo-regular-4">{formatTime(message.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessageBox;
