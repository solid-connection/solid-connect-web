"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import type { ChatAttachment, ChatMessage } from "@/types/chat";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { formatTime } from "@/utils/datetimeUtils";
import { downloadFile, getFileExtension, getFileNamePrefix } from "@/utils/fileUtils";
import { getMessageType, shouldShowContent } from "./_utils/messageUtils";

const CHAT_IMAGE_HEALTH_CHECK_LIMIT = 10;
const CHAT_IMAGE_HEALTH_CHECK_INTERVAL_MS = 1000;
const CHAT_IMAGE_HEALTH_CHECK_SLOW_INTERVAL_MS = 5000;

interface ChatMessageBoxProps {
  message: ChatMessage;
  currentUserId?: number; // 현재 사용자 ID
  partnerNickname?: string; // 상대방 닉네임
  isPartnerMentor?: boolean;
}

const appendHealthCheckCacheBuster = (src: string, attempt: number) => {
  if (src.startsWith("blob:") || src.startsWith("data:")) return src;

  try {
    const url = new URL(src, window.location.origin);
    url.searchParams.set("__chat_image_health_check", `${Date.now()}-${attempt}`);
    return url.toString();
  } catch {
    return src;
  }
};

const isLocalPreviewUrl = (src: string) => src.startsWith("blob:") || src.startsWith("data:");

const ChatImageLoading = () => (
  <div className="flex h-[150px] w-[200px] max-w-[200px] items-center justify-center rounded-lg bg-k-50">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const useChatImageHealthCheck = (src: string, enabled: boolean) => {
  const [isReady, setIsReady] = useState(!enabled);
  const [readySrc, setReadySrc] = useState(src);

  useEffect(() => {
    if (!enabled || !src) {
      setIsReady(true);
      setReadySrc(src);
      return;
    }

    let isCancelled = false;
    let attempt = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let probeImage: HTMLImageElement | null = null;

    setIsReady(false);
    setReadySrc("");

    const checkImage = () => {
      attempt += 1;
      probeImage = document.createElement("img");

      probeImage.onload = () => {
        if (isCancelled) return;
        setIsReady(true);
        setReadySrc(probeImage?.src ?? src);
      };

      probeImage.onerror = () => {
        if (isCancelled) return;

        const retryDelayMs =
          attempt >= CHAT_IMAGE_HEALTH_CHECK_LIMIT
            ? CHAT_IMAGE_HEALTH_CHECK_SLOW_INTERVAL_MS
            : CHAT_IMAGE_HEALTH_CHECK_INTERVAL_MS;
        timeoutId = setTimeout(checkImage, retryDelayMs);
      };

      probeImage.src = appendHealthCheckCacheBuster(src, attempt);
    };

    checkImage();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (probeImage) {
        probeImage.onload = null;
        probeImage.onerror = null;
      }
    };
  }, [enabled, src]);

  return { isReady, readySrc };
};

const ChatImage = ({ attachment }: { attachment: ChatAttachment }) => {
  const imageSrc = attachment.previewUrl ?? attachment.thumbnailUrl ?? attachment.url;
  const normalizedImageSrc = normalizeImageUrlToUploadCdn(imageSrc);
  const shouldHealthCheck = !attachment.previewUrl && !isLocalPreviewUrl(normalizedImageSrc);
  const { isReady, readySrc } = useChatImageHealthCheck(normalizedImageSrc, shouldHealthCheck);
  const displaySrc = readySrc || normalizedImageSrc;
  const [isImageLoaded, setIsImageLoaded] = useState(!shouldHealthCheck || isLocalPreviewUrl(displaySrc));

  useEffect(() => {
    setIsImageLoaded(!shouldHealthCheck || isLocalPreviewUrl(displaySrc));
  }, [displaySrc, shouldHealthCheck]);

  return (
    <div className="relative h-[150px] w-[200px] max-w-[200px] overflow-hidden rounded-lg">
      {(!isReady || !isImageLoaded) && (
        <div className="absolute inset-0 z-10">
          <ChatImageLoading />
        </div>
      )}
      {isReady && (
        <Image
          src={displaySrc}
          alt="첨부 이미지"
          width={200}
          height={150}
          className={`h-full w-full max-w-[200px] rounded-lg object-cover ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          unoptimized
          onLoad={() => setIsImageLoaded(true)}
        />
      )}
    </div>
  );
};

const ChatMessageBox = ({
  message,
  currentUserId = 1,
  partnerNickname = "상대방",
  isPartnerMentor = false,
}: ChatMessageBoxProps) => {
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
              <ChatImage attachment={attachment} />
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
                  <div className="text-k-900 typo-medium-2">첨부파일</div>
                  <div className="text-k-400 typo-regular-4">클릭시 다운로드 됩니다</div>
                  <div className="text-secondary typo-regular-4">{getFileExtension(attachment.url)} 파일</div>
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
            <span className="text-k-500 typo-regular-4">{formatTime(message.createdAt)}</span>
            <div className="rounded-b-xl rounded-tl-xl bg-primary px-3 py-2 text-white">
              {shouldShowContent(messageType) && (
                <p className="whitespace-pre-line typo-regular-2">{message.content}</p>
              )}
              {renderAttachments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-start">
      <div className="flex max-w-xs flex-row gap-2">
        <ProfileWithBadge isMentor={isPartnerMentor} width={32} height={32} />
        <div className="flex flex-col items-start">
          <span className="mb-1 text-k-900 typo-medium-5">{partnerNickname}</span>
          <div className="flex items-end gap-1">
            <div className="rounded-b-xl rounded-tr-xl bg-k-100 px-3 py-2 text-k-900">
              {shouldShowContent(messageType) && (
                <p className="whitespace-pre-line typo-regular-2">{message.content}</p>
              )}
              {renderAttachments()}
            </div>
            <span className="text-k-500 typo-regular-4">{formatTime(message.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessageBox;
