"use client";

import clsx from "clsx";
import Link from "next/link";
import type { ReactNode, Ref, RefObject } from "react";
import { useGetPartnerInfo } from "@/apis/chat";
import { useUploadChatImages } from "@/apis/image-upload";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { type ChatMessage, ConnectionStatus } from "@/types/chat";
import { UserRole } from "@/types/mentor";
import { tokenParse } from "@/utils/jwtUtils";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import useChatListHandler from "./_hooks/useChatListHandler";
import usePutChatReadHandler from "./_hooks/usePutChatReadHandler";
import { formatDateSeparator, isSameDay } from "./_lib/dateUtils";
import ChatInputBar from "./_ui/ChatInputBar";
import ChatMessageBox from "./_ui/ChatMessageBox";

interface ChatContentProps {
  chatId: number;
}

const ChatContent = ({ chatId }: ChatContentProps) => {
  const { accessToken } = useAuthStore();
  const parsedData = tokenParse(accessToken);
  const userId = Number(parsedData?.sub ?? 0) || 0;

  const isMentor = parsedData?.role === UserRole.MENTOR || parsedData?.role === UserRole.ADMIN;
  const isPartnerMentor = !isMentor;
  const isDesktop = useIsDesktopViewport();

  // 채팅 읽음 상태 업데이트 훅 진입시 자동으로
  usePutChatReadHandler(chatId);

  // 채팅 리스트 관리 훅
  const {
    // Data & State
    messages,
    connectionStatus,
    isLoading, // 초기 데이터 로딩 상태
    isFetchingNextPage, // 이전 기록 로딩 상태

    // Refs
    scrollContainerRef, // 실제 스크롤 컨테이너 ref
    messagesEndRef, // 자동 스크롤을 위한 ref
    topDetectorRef, // 무한 스크롤 감지를 위한 ref

    // Handlers
    sendTextMessage,
    sendImageMessage,
    addImageMessagePreview,
    removeImageMessagePreviews,
  } = useChatListHandler(chatId);

  const uploadChatImagesMutation = useUploadChatImages();

  const { data: partnerInfo } = useGetPartnerInfo(chatId);

  const { partnerId, nickname, profileUrl, university } = partnerInfo ?? {};

  if (isDesktop === null) return null;

  const inputBar = (
    <ChatInputBar
      onSendMessage={(data) => {
        sendTextMessage(data.message, userId);
      }}
      onSendImages={async (data) => {
        const previewUrls = addImageMessagePreview(data.images, userId);

        try {
          const imageUrls = await uploadChatImagesMutation.mutateAsync(data.images);
          const isSent = sendImageMessage(imageUrls, previewUrls);

          if (!isSent) {
            removeImageMessagePreviews(previewUrls);
            showIconToast("logo", "채팅 연결이 원활하지 않아 이미지를 전송하지 못했어요.");
          }
        } catch {
          removeImageMessagePreviews(previewUrls);
          showIconToast("logo", "이미지 전송에 실패했어요. 다시 시도해주세요.");
        }
      }}
      onSendFiles={(data) => {
        addImageMessagePreview(data.files, userId);
      }}
    />
  );

  const viewProps: ChatContentViewProps = {
    userId,
    isMentor,
    isPartnerMentor,
    partnerId,
    nickname,
    profileUrl,
    university,
    messages,
    connectionStatus,
    isLoading,
    isFetchingNextPage,
    scrollContainerRef,
    messagesEndRef,
    topDetectorRef,
    inputBar,
  };

  return isDesktop ? <DesktopChatContentView {...viewProps} /> : <MobileChatContentView {...viewProps} />;
};

type ChatContentViewProps = {
  userId: number;
  isMentor: boolean;
  isPartnerMentor: boolean;
  partnerId?: number;
  nickname?: string;
  profileUrl?: string | null;
  university?: string | null;
  messages: ChatMessage[];
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  topDetectorRef: Ref<HTMLDivElement>;
  inputBar: ReactNode;
};

type ChatContentViewBaseProps = ChatContentViewProps & {
  isDesktop: boolean;
};

const ChatContentViewBase = ({
  userId,
  isMentor,
  isPartnerMentor,
  partnerId,
  nickname,
  profileUrl,
  university,
  messages,
  connectionStatus,
  isLoading,
  isFetchingNextPage,
  scrollContainerRef,
  messagesEndRef,
  topDetectorRef,
  inputBar,
  isDesktop,
}: ChatContentViewBaseProps) => (
  <div
    className={clsx(
      "relative flex flex-col",
      isDesktop
        ? "h-[calc(100vh-204px)] min-h-[560px] overflow-hidden rounded-lg border border-k-100 bg-white"
        : "h-[calc(100vh-112px)]",
    )}
  >
    <div className="flex-1 overflow-hidden">
      <div className={clsx("flex h-full flex-col", isDesktop ? "px-6 pb-3" : "px-5 pb-2")}>
        <PartnerSummary
          isMentor={isMentor}
          isPartnerMentor={isPartnerMentor}
          partnerId={partnerId}
          nickname={nickname}
          profileUrl={profileUrl}
          university={university}
          connectionStatus={connectionStatus}
          isDesktop={isDesktop}
        />
        <ChatMessageList
          userId={userId}
          isPartnerMentor={isPartnerMentor}
          nickname={nickname}
          profileUrl={profileUrl}
          messages={messages}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          scrollContainerRef={scrollContainerRef}
          messagesEndRef={messagesEndRef}
          topDetectorRef={topDetectorRef}
          isDesktop={isDesktop}
        />
      </div>
    </div>
    {inputBar}
  </div>
);

const DesktopChatContentView = (props: ChatContentViewProps) => <ChatContentViewBase {...props} isDesktop />;

const MobileChatContentView = (props: ChatContentViewProps) => <ChatContentViewBase {...props} isDesktop={false} />;

type PartnerSummaryProps = {
  isMentor: boolean;
  isPartnerMentor: boolean;
  partnerId?: number;
  nickname?: string;
  profileUrl?: string | null;
  university?: string | null;
  connectionStatus: ConnectionStatus;
  isDesktop: boolean;
};

const PartnerSummary = ({
  isMentor,
  isPartnerMentor,
  partnerId,
  nickname,
  profileUrl,
  university,
  connectionStatus,
  isDesktop,
}: PartnerSummaryProps) => (
  <div className={clsx("z-10 w-full flex-shrink-0", isDesktop ? "border-b border-k-100 py-4" : "mt-5 h-16")}>
    <div
      className={clsx(
        "flex w-full items-center justify-between",
        isDesktop ? "rounded-lg px-4 py-3" : "rounded px-2.5 py-2",
        isMentor ? "bg-sub-c-100 text-sub-c-500" : "bg-primary-100 text-primary",
      )}
    >
      <div className="flex items-center gap-2">
        <ProfileWithBadge profileImageUrl={profileUrl} isMentor={isPartnerMentor} width={30} height={30} />
        <div className="flex h-full items-center">
          <span className="text-k-700 typo-sb-7">{nickname}</span>
          <div className="mx-4 h-10 w-[1px] bg-k-100"></div>
          <div className="flex typo-medium-2">{university ? university : "예비솔커"}</div>
        </div>
      </div>
      <Link
        className={clsx("rounded-3xl px-4 py-2 text-k-0 typo-sb-9", isMentor ? "bg-sub-c-500" : "bg-primary")}
        href={isMentor ? `/${partnerId}` : `/mentor/${partnerId}`}
      >
        {isMentor ? "멘티 페이지" : "멘토 페이지"}
      </Link>
    </div>
    <div className={clsx("bg-white px-4 text-center", isDesktop ? "pt-3" : "rounded py-2")}>
      <div className="rounded bg-white px-4 py-2 text-center">
        {connectionStatus === ConnectionStatus.Connected ? (
          <p
            className={clsx(
              "bg-gradient-to-r bg-clip-text text-transparent typo-sb-9",
              isMentor ? "from-sub-c-500 to-primary-600" : "from-primary to-sub-a",
            )}
          >
            멘토링이 연결되었습니다! 채팅을 시작해보세요!
          </p>
        ) : connectionStatus === ConnectionStatus.Pending ? (
          <p className="text-yellow-500 typo-sb-9">연결 대기 중입니다. 잠시만 기다려주세요.</p>
        ) : connectionStatus === ConnectionStatus.Error ? (
          <p className="text-red-500 typo-sb-9">연결 중 오류가 발생했습니다. 다시 시도해주세요.</p>
        ) : connectionStatus === ConnectionStatus.Disconnected ? (
          <p className="text-gray-500 typo-sb-9">연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.</p>
        ) : null}
      </div>
    </div>
  </div>
);

type ChatMessageListProps = {
  userId: number;
  isPartnerMentor: boolean;
  nickname?: string;
  profileUrl?: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  topDetectorRef: Ref<HTMLDivElement>;
  isDesktop: boolean;
};

const ChatMessageList = ({
  userId,
  isPartnerMentor,
  nickname,
  profileUrl,
  messages,
  isLoading,
  isFetchingNextPage,
  scrollContainerRef,
  messagesEndRef,
  topDetectorRef,
  isDesktop,
}: ChatMessageListProps) => (
  <div
    ref={scrollContainerRef}
    className={clsx("scrollbar-hide flex-1 overflow-y-auto", isDesktop ? "p-6" : "mt-4 p-4 pb-6")}
    style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}
  >
    {isLoading && (
      <div className="flex justify-center py-4">
        <span className="text-k-500">채팅 기록을 불러오는 중...</span>
      </div>
    )}

    <div className="space-y-4">
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-k-500 typo-regular-2">이전 메시지를 불러오는 중...</span>
          </div>
        </div>
      )}

      {messages.map((message, index) => {
        const showDateSeparator = index === 0 || !isSameDay(messages[index - 1].createdAt, message.createdAt);
        const previewMessageKey = message.attachments
          .map((attachment) => attachment.previewUrl)
          .find((previewUrl): previewUrl is string => Boolean(previewUrl));
        const messageKey = previewMessageKey
          ? `preview-${previewMessageKey}`
          : message.id > 0
            ? `message-${message.id}`
            : `message-${message.senderId}-${message.createdAt}-${message.content}-${index}`;

        return (
          <div key={messageKey} ref={index === 0 ? topDetectorRef : null}>
            {showDateSeparator && (
              <div className="my-4 mb-6 flex w-full justify-center">
                <span className="rounded-full bg-k-50 px-3 py-1 text-k-600 typo-regular-2">
                  {formatDateSeparator(message.createdAt)}
                </span>
              </div>
            )}
            <ChatMessageBox
              message={message}
              currentUserId={userId}
              partnerNickname={nickname}
              partnerProfileUrl={profileUrl}
              isPartnerMentor={isPartnerMentor}
            />
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  </div>
);

export default ChatContent;
