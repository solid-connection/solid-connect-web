"use client";

import { useGetPartnerInfo } from "@/apis/chat";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

interface ChatNavBarProps {
  chatId: number;
}

const ChatNavBar = ({ chatId }: ChatNavBarProps) => {
  const { data: partnerInfo, isPending, isError, isFetching, refetch } = useGetPartnerInfo(chatId);

  return (
    <nav aria-label="채팅 탐색">
      <TopDetailNavigation
        title={partnerInfo?.nickname ? `${partnerInfo.nickname}님과 채팅` : "멘토 채팅"}
        backHref="/mentor/chat"
        icon={
          <details key={chatId} className="relative">
            <summary className="cursor-pointer rounded px-2 py-1 text-k-700 typo-medium-3">참여자</summary>
            <div className="absolute right-0 top-10 z-40 w-64 max-w-[80vw] rounded-lg border border-k-100 bg-white p-4 shadow-sdwB">
              <h2 className="mb-3 text-k-900 typo-sb-7">채팅 참여자</h2>
              {isPending ? (
                <p role="status" className="text-k-500 typo-regular-4">
                  참여자 정보를 불러오는 중이에요.
                </p>
              ) : isError ? (
                <div className="space-y-2">
                  <p role="alert" className="text-k-700 typo-regular-4">
                    참여자 정보를 불러오지 못했어요.
                  </p>
                  <button
                    type="button"
                    disabled={isFetching}
                    onClick={() => void refetch()}
                    className="rounded border border-k-200 px-3 py-1 typo-regular-4 disabled:opacity-50"
                  >
                    다시 시도
                  </button>
                </div>
              ) : (
                <ul className="space-y-3 text-k-800 typo-medium-3">
                  <li>나</li>
                  <li className="flex items-center gap-2">
                    <ProfileWithBadge profileImageUrl={partnerInfo?.profileUrl} width={32} height={32} />
                    <div className="min-w-0">
                      <p className="break-words">{partnerInfo?.nickname ?? "상대방"}</p>
                      {partnerInfo?.university && <p className="text-k-500 typo-regular-4">{partnerInfo.university}</p>}
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </details>
        }
      />
    </nav>
  );
};

export default ChatNavBar;
