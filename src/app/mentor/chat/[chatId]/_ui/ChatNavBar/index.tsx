"use client";

import Link from "next/link";
import { useState } from "react";

import clsx from "clsx";

import { tokenParse } from "@/utils/jwtUtils";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import ReportPanel from "../../../../../../components/ui/ReportPanel";

import { UserRole } from "@/types/mentor";

import { useGetMyInfo } from "@/apis/MyPage";
import { useGetPartnerInfo } from "@/apis/chat";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconAlert, IconAlertSubC, IconDirectionRight, IconSetting } from "@/public/svgs/mentor";

interface ChatNavBarProps {
  chatId: number;
}

const ChatNavBar = ({ chatId }: ChatNavBarProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const result = tokenParse(useAuthStore.getState().accessToken);
  const isMentor = result?.role === UserRole.MENTOR || result?.role === UserRole.ADMIN;

  // 파트너 정보 가져오기
  const { data: partnerInfo } = useGetPartnerInfo(chatId);
  const { data: myInfo } = useGetMyInfo();

  const handleSettingsClick = () => {
    if (!isExpanded) {
      // 열기
      setIsAnimating(true);
      setIsExpanded(true);
    } else {
      // 닫기
      setIsExpanded(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // 애니메이션 시간과 동일
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative">
      <nav>
        <TopDetailNavigation
          title={"멘토 채팅"}
          icon={
            <button className="h-4 w-4" onClick={handleSettingsClick}>
              <IconSetting />
            </button>
          }
        />
      </nav>

      {/* 오버레이 (패널 외부 클릭 시 닫기) */}
      {(isExpanded || isAnimating) && (
        <button
          className={clsx("fixed inset-0 right-0 top-0 z-20 bg-black bg-opacity-20", {
            "animate-fadeIn": isExpanded,
            "animate-fadeOut": !isExpanded && isAnimating,
          })}
          onClick={handleClose}
          aria-label="설정 패널 닫기"
        />
      )}
      {/* 확장된 설정 패널 */}
      {(isExpanded || isAnimating) && (
        <div
          className={clsx(
            "fixed right-0 top-0 z-30 h-[100vh] w-80 overflow-y-auto rounded-l-2xl bg-white p-4 shadow-2xl",
            {
              "animate-slideInRight": isExpanded,
              "animate-slideOutRight": !isExpanded && isAnimating,
            },
          )}
        >
          {/* 상대방 프로필 섹션 */}
          <div className="w-full">
            <button className="h-[30px] w-[30px]" onClick={handleClose} aria-label="뒤로가기">
              <IconDirectionRight />
            </button>
          </div>
          <div className="mb-6 flex flex-col items-center">
            <ProfileWithBadge profileImageUrl={partnerInfo?.profileUrl} width={64} height={64} />
            <h3 className="text-gray-800 typo-sb-5">{partnerInfo?.nickname || "상대방"}</h3>
            <p className={clsx("typo-medium-2", { "text-sub-c-500": isMentor, "text-primary-500": !isMentor })}>
              {partnerInfo?.university || "예비솔커"}
            </p>

            <Link
              // TODO 멘티 페이지 라우터 변경 시 수정 필요
              href={`/mentor/${partnerInfo?.partnerId}`}
              className={clsx("mt-3 w-full rounded-3xl px-4 py-2 text-center text-white typo-medium-2", {
                "bg-sub-c-500": isMentor,
                "bg-primary": !isMentor,
              })}
            >
              {isMentor ? "멘티 페이지 가기" : "멘토 페이지 가기"}
            </Link>
          </div>

          <hr className="mb-6 mt-6" />
          {/* 알림 설정 */}
          <div className="mb-4 flex items-center justify-between py-2">
            <div className="flex items-center gap-1">
              <span className="h-[18px] w-[18px]">{isMentor ? <IconAlertSubC /> : <IconAlert />}</span>
              <span className="text-k-800 typo-medium-3">알림</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked disabled />
              <div
                className={clsx(
                  "peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none",
                  {
                    "bg-primary-300 peer-checked:bg-primary-500": !isMentor,
                    "bg-sub-c-300 peer-checked:bg-sub-c-500": isMentor,
                    "cursor-not-allowed opacity-50": true, // 비활성화 시 시각적으로 표시
                  },
                )}
              ></div>
            </label>
          </div>
          <hr className="mb-6 mt-6" />
          {/* 참여자 섹션 */}
          <p className="text-gray-600 typo-regular-2">참여자 2</p>
          <div className="mt-2 space-y-3">
            {/* 현재 사용자 */}
            <div className="flex items-center gap-3">
              <ProfileWithBadge profileImageUrl={myInfo?.profileImageUrl} width={24} height={24} />
              {/* '나' 표시 div */}
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-pink-200">
                <span className="text-center text-pink-600 typo-medium-5">나</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-k-800 typo-medium-2">
                  {myInfo?.nickname || "나"} ({myInfo?.role === UserRole.ADMIN ? "어드민" : isMentor ? "멘토" : "멘티"})
                </span>
              </div>
            </div>

            {/* 상대방 */}
            <div className="flex items-center gap-3">
              <ProfileWithBadge profileImageUrl={partnerInfo?.profileUrl} width={24} height={24} />
              <span className="text-k-800 typo-medium-2">
                {partnerInfo?.nickname || "상대방"} ({isMentor ? "멘티" : "멘토"})
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 flex w-full items-center rounded-bl-2xl bg-white px-[10px] py-[22px] shadow-top">
            <ReportPanel idx={chatId} />
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatNavBar;
