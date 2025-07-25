"use client";

import { useState } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { IconAlert, IconDirectionRight, IconSetting } from "@/public/svgs/mentor";

const ChatNavBar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSettingsClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <nav>
        <TopDetailNavigation
          title={"멘토 채팅"}
          icon={
            <button className="h-3 w-4" onClick={handleSettingsClick}>
              <IconSetting />
            </button>
          }
        />
      </nav>

      {/* 오버레이 (패널 외부 클릭 시 닫기) */}
      {isExpanded && (
        <button
          className="fixed inset-0 right-0 top-0 z-50 bg-black bg-opacity-20"
          onClick={() => setIsExpanded(false)}
          aria-label="설정 패널 닫기"
        />
      )}
      {/* 확장된 설정 패널 */}
      {isExpanded && (
        <div className="fixed right-0 top-0 z-50 h-[100vh] w-80 overflow-y-auto rounded-l-2xl bg-white p-4">
          {/* 멘토 프로필 섹션 */}
          <div className="w-full">
            <button className="h-[30px] w-[30px]" onClick={() => setIsExpanded(false)} aria-label="뒤로가기">
              <IconDirectionRight />
            </button>
          </div>
          <div className="mb-6 flex flex-col items-center">
            <ProfileWithBadge width={64} height={64} />
            <h3 className="text-lg font-semibold text-gray-800">김솔커 멘토</h3>
            <p className="text-sm font-medium text-primary">스마트팜 / 뮌헨기술대학</p>

            <button className="mt-3 w-full rounded-3xl bg-primary px-4 py-2 font-medium text-white">
              멘토 페이지 가기
            </button>
          </div>

          <hr className="mb-6 mt-6" />
          {/* 알림 설정 */}
          <div className="mb-4 flex items-center justify-between py-2">
            <div className="flex items-center gap-1">
              <span className="h-[18px] w-[18px]">
                <IconAlert />
              </span>
              <span className="text-[13px] font-medium text-k-800">알림</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-primary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
            </label>
          </div>
          <hr className="mb-6 mt-6" />
          {/* 참여자 섹션 */}
          <p className="text-sm text-gray-600">참여자 2</p>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-3">
              <ProfileWithBadge width={24} height={24} />
              {/* '나' 표시 div */}
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-pink-200">
                <span className="text-center text-[6px] font-medium text-pink-600">나</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-k-800">박솔커 (멘티)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ProfileWithBadge width={24} height={24} />
              <span className="text-sm font-medium text-k-800">김솔커 (멘토)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatNavBar;
