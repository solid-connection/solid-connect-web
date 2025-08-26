"use client";

import Link from "next/link";
import { useState } from "react";

import useRouterHandler from "../../../lib/hooks/useJWTParseRouteHandler";

import useGetMentoringUncheckedCount from "@/api/mentor/client/useGetMentoringUncheckedCount";

const MentorApplyCountContent = () => {
  // 로그인 된경우에만 신규 신청 카운트 모달 표시
  const { isMentor = false, isLoading } = useRouterHandler(false);
  const { data: count, isSuccess } = useGetMentoringUncheckedCount(isMentor && !isLoading);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  // 신규 신청 없으면 표시
  if (!isMentor || isLoading || !isSuccess || !isModalOpen || count === 0) return null;

  return (
    <div className="fixed left-1/2 top-16 z-50 w-[80%] max-w-md -translate-x-1/2 rounded-xl bg-secondary px-6 py-4 text-white shadow-md">
      {/* close button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsModalOpen(false);
        }}
        className="absolute right-3 top-3 text-white/80 hover:text-white"
        aria-label="닫기"
      >
        ✕
      </button>
      <Link href={`/mentor`} onClick={() => setIsModalOpen(false)}>
        <div className="flex items-center">
          {/* left: message */}
          <div className="flex-1">
            <h2 className="text-xs font-semibold">알림</h2>
            <p className="mt-1 text-sm leading-snug">새로운 요청이 들어왔어요!</p>
            <p className="text-sm leading-snug">어서 요청을 수락해주세요.</p>
          </div>

          {/* divider */}
          <div className="mx-4 h-12 w-px bg-k-300" />

          {/* right: count */}
          <div className="min-w-[80px] text-center">
            <span className="text-xs">신규 신청</span>
            <div className="text-2xl font-bold">{count}명</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MentorApplyCountContent;
